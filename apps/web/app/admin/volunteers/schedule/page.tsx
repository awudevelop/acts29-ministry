'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@acts29/ui';
import { Breadcrumbs } from '@acts29/admin-ui';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-react';
import { mockVolunteerShifts, mockResources, mockProfiles } from '@acts29/database';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
} from 'date-fns';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Get shifts for the current week
  const weekShifts = mockVolunteerShifts.filter((shift) => {
    const shiftDate = new Date(shift.start_time);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  // Group shifts by day
  const shiftsByDay = weekDays.map((day) => ({
    date: day,
    shifts: weekShifts.filter((shift) => isSameDay(new Date(shift.start_time), day)),
  }));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Volunteers', href: '/admin/volunteers' },
          { label: 'Schedule' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Schedule</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage volunteer schedules by week
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/volunteers/shifts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Shift
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Filled</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span>Needs Volunteers</span>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg border bg-gray-200 overflow-hidden">
        {shiftsByDay.map(({ date, shifts }) => {
          const dayIsToday = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[200px] bg-white ${dayIsToday ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
            >
              {/* Day Header */}
              <div
                className={`border-b px-3 py-2 ${
                  dayIsToday ? 'bg-primary-50' : 'bg-gray-50'
                }`}
              >
                <p className="text-xs font-medium text-gray-500">
                  {format(date, 'EEE')}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    dayIsToday ? 'text-primary-600' : 'text-gray-900'
                  }`}
                >
                  {format(date, 'd')}
                </p>
              </div>

              {/* Shifts */}
              <div className="p-2 space-y-2">
                {shifts.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No shifts</p>
                ) : (
                  shifts.map((shift) => {
                    const resource = mockResources.find(
                      (r) => r.id === shift.resource_id
                    );
                    const volunteer = shift.volunteer_id
                      ? mockProfiles.find((p) => p.id === shift.volunteer_id)
                      : null;
                    const isFilled = !!volunteer;

                    return (
                      <Link
                        key={shift.id}
                        href={`/admin/volunteers/shifts/${shift.id}`}
                        className={`block rounded-lg p-2 text-xs transition-colors ${
                          isFilled
                            ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                            : 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        <p className="font-medium text-gray-900 truncate">
                          {shift.role}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(new Date(shift.start_time), 'h:mm a')}
                          </span>
                        </div>
                        {resource && (
                          <div className="mt-1 flex items-center gap-1 text-gray-500 truncate">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{resource.name}</span>
                          </div>
                        )}
                        <div
                          className={`mt-1 flex items-center gap-1 ${
                            isFilled ? 'text-green-600' : 'text-yellow-600'
                          }`}
                        >
                          <Users className="h-3 w-3" />
                          <span>
                            {volunteer
                              ? `${volunteer.first_name} ${volunteer.last_name?.[0]}.`
                              : 'Needs volunteers'}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total Shifts This Week</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{weekShifts.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Filled Shifts</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {weekShifts.filter((s) => s.volunteer_id).length}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Needs Volunteers</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {weekShifts.filter((s) => !s.volunteer_id).length}
          </p>
        </div>
      </div>
    </div>
  );
}
