/**
 * Acts29 Ministry - Geocoding Agent
 * Supabase Edge Function for address geocoding
 *
 * Handles:
 * - Address to coordinates conversion (forward geocoding)
 * - Coordinates to address conversion (reverse geocoding)
 * - Distance calculations
 * - Nearby resources search
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeocodeRequest {
  action: 'forward' | 'reverse' | 'nearby';
  address?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  resourceType?: string;
  limit?: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeocodeResult {
  success: boolean;
  data?: {
    coordinates?: Coordinates;
    address?: string;
    resources?: Array<{
      id: string;
      name: string;
      type: string;
      address: string;
      distance: number;
      latitude: number;
      longitude: number;
    }>;
  };
  error?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: GeocodeRequest = await req.json();
    let result: GeocodeResult;

    switch (payload.action) {
      case 'forward':
        if (!payload.address) {
          throw new Error('Address is required for forward geocoding');
        }
        result = await forwardGeocode(payload.address);
        break;

      case 'reverse':
        if (payload.latitude === undefined || payload.longitude === undefined) {
          throw new Error('Coordinates are required for reverse geocoding');
        }
        result = await reverseGeocode(payload.latitude, payload.longitude);
        break;

      case 'nearby':
        if (payload.latitude === undefined || payload.longitude === undefined) {
          throw new Error('Coordinates are required for nearby search');
        }
        result = await findNearbyResources(
          payload.latitude,
          payload.longitude,
          payload.radius ?? 50,
          payload.resourceType,
          payload.limit ?? 20
        );
        break;

      default:
        throw new Error(`Unknown action: ${payload.action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function forwardGeocode(address: string): Promise<GeocodeResult> {
  const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN');

  if (!mapboxToken) {
    // Mock response for development
    return {
      success: true,
      data: {
        coordinates: { latitude: 37.7749, longitude: -122.4194 },
        address: address,
      },
    };
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&country=US&limit=1`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return { success: false, error: 'Address not found' };
    }

    const [longitude, latitude] = data.features[0].center;

    return {
      success: true,
      data: {
        coordinates: { latitude, longitude },
        address: data.features[0].place_name,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Geocoding failed';
    return { success: false, error: message };
  }
}

async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult> {
  const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN');

  if (!mapboxToken) {
    return {
      success: true,
      data: {
        coordinates: { latitude, longitude },
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      },
    };
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return { success: false, error: 'Location not found' };
    }

    return {
      success: true,
      data: {
        coordinates: { latitude, longitude },
        address: data.features[0].place_name,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reverse geocoding failed';
    return { success: false, error: message };
  }
}

async function findNearbyResources(
  latitude: number,
  longitude: number,
  radiusKm: number,
  resourceType?: string,
  limit: number = 20
): Promise<GeocodeResult> {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Use PostGIS to find resources within radius
    // ST_DWithin uses meters, so convert km to meters
    const radiusMeters = radiusKm * 1000;

    let query = supabaseClient.rpc('find_nearby_resources', {
      user_lat: latitude,
      user_lng: longitude,
      radius_meters: radiusMeters,
      resource_type: resourceType || null,
      result_limit: limit,
    });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        resources: data ?? [],
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nearby search failed';
    return { success: false, error: message };
  }
}
