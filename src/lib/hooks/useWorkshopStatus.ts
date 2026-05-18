"use client";

import { useState, useEffect } from "react";
import { BUSINESS_HOURS, type DaySchedule } from "@/lib/constants";

interface WorkshopStatus {
  isOpen: boolean;
  nextChange: string;
  todayHours: string;
}

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

function getParisTime(): Date {
  const now = new Date();
  const parisString = now.toLocaleString("en-US", {
    timeZone: "Europe/Paris",
  });
  return new Date(parisString);
}

function formatSchedule(schedule: DaySchedule): string {
  if (!schedule) return "Ferme";
  return `${schedule.open} - ${schedule.close}`;
}

function calculateStatus(): WorkshopStatus {
  const parisNow = getParisTime();
  const dayIndex = parisNow.getDay();
  const dayKey = DAY_KEYS[dayIndex];
  const todaySchedule = BUSINESS_HOURS[dayKey];

  const todayHours = formatSchedule(todaySchedule);

  if (!todaySchedule) {
    return {
      isOpen: false,
      nextChange: "Demain",
      todayHours,
    };
  }

  const currentMinutes = parisNow.getHours() * 60 + parisNow.getMinutes();
  const [openH, openM] = todaySchedule.open.split(":").map(Number);
  const [closeH, closeM] = todaySchedule.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const remainingMinutes = closeMinutes - currentMinutes;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    const nextChange =
      hours > 0 ? `Ferme dans ${hours}h${mins > 0 ? mins : ""}` : `Ferme dans ${mins}min`;
    return { isOpen: true, nextChange, todayHours };
  }

  if (currentMinutes < openMinutes) {
    const remainingMinutes = openMinutes - currentMinutes;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    const nextChange =
      hours > 0 ? `Ouvre dans ${hours}h${mins > 0 ? mins : ""}` : `Ouvre dans ${mins}min`;
    return { isOpen: false, nextChange, todayHours };
  }

  return {
    isOpen: false,
    nextChange: "Demain",
    todayHours,
  };
}

export function useWorkshopStatus(): WorkshopStatus {
  const [status, setStatus] = useState<WorkshopStatus>(calculateStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(calculateStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
