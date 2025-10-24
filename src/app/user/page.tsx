'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Room {
  _id: string;
  name: string;
  capacity: number;
  resources: string;
}

interface Reservation {
  _id: string;
  roomId: { _id: string; name: string };
  userId: { name: string; email: string };
  date: string;
  startTime: string;
  endTime: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadRooms();
    loadReservations();
  }, [selectedDate]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  };

  const loadRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const loadReservations = async () => {
    try {
      const response = await fetch(`/api/reservations?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Reserva criada com sucesso!');
        setFormData({
          roomId: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '',
          endTime: '',
        });
        loadReservations();
      } else {
        alert(data.error || 'Erro ao criar reserva');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const getReservationsForRoom = (roomId: string) => {
    return reservations.filter(res => res.roomId._id === roomId);
  };

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    const dayOfWeek = start.getDay();
    const monday = new Date(start);
    monday.setDate(start.getDate() - dayOfWeek + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel do Usuário</h1>
              <p className="text-gray-600">Connect Coworking</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Painel Admin
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 rounded-md font-medium ${
                  viewMode === 'daily'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visualização Diária
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-md font-medium ${
                  viewMode === 'weekly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calendário Semanal
              </button>
            </div>
          </div>

          {viewMode === 'daily' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily View */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Reservas de Hoje</h2>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room._id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-gray-600">Capacidade: {room.capacity}</p>
                      <p className="text-gray-600">Recursos: {room.resources}</p>
                      <div className="mt-2">
                        <h4 className="font-medium">Reservas:</h4>
                        {getReservationsForRoom(room._id).length > 0 ? (
                          <ul className="list-disc list-inside">
                            {getReservationsForRoom(room._id).map((res) => (
                              <li key={res._id} className="text-sm">
                                {res.startTime} - {res.endTime} ({res.userId.name})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">Nenhuma reserva hoje</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Make Reservation */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Fazer Reserva</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sala</label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione uma sala</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.name} (Capacidade: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Horário de Início</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Horário de Fim</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Reservando...' : 'Fazer Reserva'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {viewMode === 'weekly' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Calendário Semanal</h2>
              <div className="grid grid-cols-7 gap-4">
                {getWeekDates().map((date) => (
                  <div key={date} className="border rounded-lg p-4 min-h-[200px]">
                    <h3 className="font-semibold text-center mb-2">
                      {new Date(date).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="space-y-1">
                      {rooms.map((room) => {
                        const roomReservations = reservations.filter(
                          res => res.roomId._id === room._id && res.date === date
                        );
                        return roomReservations.map((res) => (
                          <div key={res._id} className="text-xs bg-blue-100 p-1 rounded">
                            <div className="font-medium">{room.name}</div>
                            <div>{res.startTime}-{res.endTime}</div>
                            <div className="text-gray-600">{res.userId.name}</div>
                          </div>
                        ));
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
