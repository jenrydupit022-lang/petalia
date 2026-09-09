"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Flower = {
  id: number;
  name: string;
  stock: number;
};

type EventStock = {
  id: number;
  name: string;
  flowers: Flower[];
};

const STORAGE_KEY = "petalia_event_stock";

export default function InventoryPage() {
  const [events, setEvents] = useState<EventStock[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<EventStock | null>(null);

  const [eventName, setEventName] = useState("");
  const [flowerName, setFlowerName] = useState("");
  const [flowerStock, setFlowerStock] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  function saveEvents(updatedEvents: EventStock[]) {
    setEvents(updatedEvents);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedEvents)
    );
  }

  function addEvent() {
    if (!eventName.trim()) {
      alert("Please enter an event name.");
      return;
    }

    const newEvent: EventStock = {
      id: Date.now(),
      name: eventName.trim(),
      flowers: [],
    };

    saveEvents([...events, newEvent]);
    setEventName("");
  }

  function deleteEvent(eventId: number) {
    if (!confirm("Delete this event?")) return;

    saveEvents(
      events.filter((event) => event.id !== eventId)
    );

    setSelectedEvent(null);
  }

  function addFlower() {
    if (!selectedEvent) return;

    if (!flowerName.trim()) {
      alert("Please enter a flower name.");
      return;
    }

    const stock = Number(flowerStock);

    if (!Number.isFinite(stock) || stock < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    const newFlower: Flower = {
      id: Date.now(),
      name: flowerName.trim(),
      stock,
    };

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            flowers: [...event.flowers, newFlower],
          }
        : event
    );

    saveEvents(updatedEvents);

    setSelectedEvent({
      ...selectedEvent,
      flowers: [...selectedEvent.flowers, newFlower],
    });

    setFlowerName("");
    setFlowerStock("");
  }

  function editFlower(flower: Flower) {
    if (!selectedEvent) return;

    const newStock = prompt(
      `Enter new stock for ${flower.name}:`,
      String(flower.stock)
    );

    if (newStock === null) return;

    const stock = Number(newStock);

    if (!Number.isFinite(stock) || stock < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    const updatedFlowers = selectedEvent.flowers.map(
      (item) =>
        item.id === flower.id
          ? { ...item, stock }
          : item
    );

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            flowers: updatedFlowers,
          }
        : event
    );

    saveEvents(updatedEvents);

    setSelectedEvent({
      ...selectedEvent,
      flowers: updatedFlowers,
    });
  }

  function deleteFlower(flowerId: number) {
    if (!selectedEvent) return;

    if (!confirm("Delete this flower?")) return;

    const updatedFlowers =
      selectedEvent.flowers.filter(
        (flower) => flower.id !== flowerId
      );

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            flowers: updatedFlowers,
          }
        : event
    );

    saveEvents(updatedEvents);

    setSelectedEvent({
      ...selectedEvent,
      flowers: updatedFlowers,
    });
  }

  function openEvent(event: EventStock) {
    setSelectedEvent(event);
  }

  return (
    <main className="min-h-screen bg-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-pink-600">
              📦 Event Flower Stock
            </h1>

            <p className="text-gray-500 mt-2">
              Manage flower stocks for each event.
            </p>
          </div>

          <Link
            href="/petalia"
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold text-center"
          >
            ← Back to Petalia
          </Link>

        </div>

        {/* EVENT LIST */}
        {!selectedEvent && (
          <div className="space-y-6">

            <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100">

              <h2 className="text-xl font-bold text-gray-700 mb-4">
                ➕ Add Event
              </h2>

              <div className="flex flex-col md:flex-row gap-3">

                <input
                  type="text"
                  value={eventName}
                  onChange={(e) =>
                    setEventName(e.target.value)
                  }
                  placeholder="Example: Teacher's Day 2026"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
                />

                <button
                  onClick={addEvent}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  + Add Event
                </button>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl shadow-md p-6 border border-pink-100"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-bold text-gray-700">
                        🌸 {event.name}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        {event.flowers.length} flower type
                        {event.flowers.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>

                  </div>

                  <button
                    onClick={() => openEvent(event)}
                    className="w-full mt-5 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Open Event
                  </button>

                </div>
              ))}

            </div>

            {events.length === 0 && (
              <div className="bg-white rounded-3xl shadow-md p-10 text-center">
                <div className="text-5xl mb-3">
                  📦
                </div>

                <p className="text-gray-500">
                  No events yet. Add your first event above.
                </p>
              </div>
            )}

          </div>
        )}

        {/* SELECTED EVENT */}
        {selectedEvent && (
          <div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mb-5 text-pink-600 font-semibold hover:underline"
            >
              ← Back to Events
            </button>

            <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 mb-6">

              <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
                🌸 {selectedEvent.name}
              </h2>

              <p className="text-gray-500 mt-1">
                Flower stock
              </p>

            </div>

            {/* ADD FLOWER */}
            <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 mb-6">

              <h2 className="text-xl font-bold text-gray-700 mb-4">
                ➕ Add Flower
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <input
                  type="text"
                  value={flowerName}
                  onChange={(e) =>
                    setFlowerName(e.target.value)
                  }
                  placeholder="Flower name"
                  className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
                />

                <input
                  type="number"
                  min="0"
                  value={flowerStock}
                  onChange={(e) =>
                    setFlowerStock(e.target.value)
                  }
                  placeholder="Stock quantity"
                  className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
                />

                <button
                  onClick={addFlower}
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-5 py-3 font-semibold"
                >
                  + Add Flower
                </button>

              </div>

            </div>

            {/* FLOWER STOCK */}
            <div className="bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden">

              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-700">
                  🌷 Current Stock
                </h2>
              </div>

              {selectedEvent.flowers.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  No flowers added yet.
                </div>
              ) : (
                <div className="divide-y">

                  {selectedEvent.flowers.map(
                    (flower) => (
                      <div
                        key={flower.id}
                        className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >

                        <div>
                          <p className="text-lg font-bold text-gray-700">
                            🌸 {flower.name}
                          </p>

                          <p className="text-gray-500">
                            Stock:{" "}
                            <span className="font-bold text-pink-600">
                              {flower.stock}
                            </span>
                          </p>
                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              editFlower(flower)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Edit Stock
                          </button>

                          <button
                            onClick={() =>
                              deleteFlower(flower.id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}