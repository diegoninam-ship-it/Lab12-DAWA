'use client';

import { useState, useEffect } from 'react';

interface Author {
  id: string;
  name: string;
  email: string;
  nationality: string;
  birthYear: number;
  bio?: string;
}

interface AuthorStats {
  authorId: string;
  authorName: string;
  totalBooks: number;
  averagePages: number;
  genres: string[];
}

export default function Home() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Record<string, AuthorStats>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nationality: '',
    birthYear: '',
    bio: '',
  });

  // Cargar autores al montar el componente
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
        // Cargar estadísticas de cada autor
        data.forEach((author: Author) => {
          fetchAuthorStats(author.id);
        });
      }
    } catch (error) {
      console.error('Error al cargar autores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorStats = async (authorId: string) => {
    try {
      const response = await fetch(`/api/authors/${authorId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats((prev) => ({ ...prev, [authorId]: data }));
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingAuthor 
        ? `/api/authors/${editingAuthor.id}`
        : '/api/authors';
      
      const method = editingAuthor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthYear: parseInt(formData.birthYear),
        }),
      });

      if (response.ok) {
        await fetchAuthors();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar el autor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el autor');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      nationality: author.nationality,
      birthYear: author.birthYear.toString(),
      bio: author.bio || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este autor?')) return;
    
    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAuthors();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar el autor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el autor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      nationality: '',
      birthYear: '',
      bio: '',
    });
    setEditingAuthor(null);
    setShowForm(false);
  };

  // Calcular estadísticas generales
  const totalAuthors = authors.length;
  const totalBooks = Object.values(stats).reduce((sum, s) => sum + s.totalBooks, 0);
  const allGenres = [...new Set(Object.values(stats).flatMap(s => s.genres))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Biblioteca
          </h1>
          <p className="text-gray-600">Gestión de autores y libros</p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Autores</h3>
            <p className="text-3xl font-bold text-blue-600">{totalAuthors}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Libros</h3>
            <p className="text-3xl font-bold text-green-600">{totalBooks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Géneros Únicos</h3>
            <p className="text-3xl font-bold text-purple-600">{allGenres.length}</p>
          </div>
        </div>

        {/* Botón para crear autor */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Crear Nuevo Autor
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingAuthor ? 'Editar Autor' : 'Crear Nuevo Autor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nacionalidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año de Nacimiento *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingAuthor ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Autores */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Lista de Autores</h2>
          </div>
          {authors.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay autores registrados. ¡Crea el primero!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {authors.map((author) => (
                <div key={author.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {author.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{author.email}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>🌍 {author.nationality}</span>
                        <span>📅 {author.birthYear}</span>
                        {stats[author.id] && (
                          <>
                            <span>📚 {stats[author.id].totalBooks} libros</span>
                            <span>📄 {stats[author.id].averagePages} págs promedio</span>
                          </>
                        )}
                      </div>
                      {author.bio && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {author.bio}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`/authors/${author.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Ver Detalle
                      </a>
                      <a
                        href={`/books?authorId=${author.id}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Ver Libros
                      </a>
                      <button
                        onClick={() => handleEdit(author)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enlaces de navegación */}
        <div className="mt-8 flex gap-4">
          <a
            href="/books"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ir a Búsqueda de Libros
          </a>
        </div>
      </div>
    </div>
  );
}