'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Author {
  id: string;
  name: string;
  email: string;
  nationality: string;
  birthYear: number;
  bio?: string;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  pages: number;
  authorId: string;
}

interface Stats {
  authorId: string;
  authorName: string;
  totalBooks: number;
  firstBook: { title: string; year: number } | null;
  latestBook: { title: string; year: number } | null;
  averagePages: number;
  genres: string[];
  longestBook: { title: string; pages: number } | null;
  shortestBook: { title: string; pages: number } | null;
}

export default function AuthorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    nationality: '',
    birthYear: '',
    bio: '',
  });

  const [newBookData, setNewBookData] = useState({
    title: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [authorRes, statsRes, booksRes] = await Promise.all([
        fetch(`/api/authors/${id}`),
        fetch(`/api/authors/${id}/stats`),
        fetch(`/api/authors/${id}/books`),
      ]);

      if (authorRes.ok) setAuthor(await authorRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (booksRes.ok) setBooks(await booksRes.json());
    } catch (error) {
      console.error('Error al cargar datos del autor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editFormData,
          birthYear: parseInt(editFormData.birthYear),
        }),
      });

      if (response.ok) {
        await fetchData();
        setShowEditForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar el autor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el autor');
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBookData,
          publishedYear: parseInt(newBookData.publishedYear),
          pages: parseInt(newBookData.pages),
          authorId: id,
        }),
      });

      if (response.ok) {
        await fetchData();
        setShowAddBookForm(false);
        setNewBookData({ title: '', description: '', isbn: '', publishedYear: '', genre: '', pages: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear el libro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el libro');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando detalles del autor...</div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Autor no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{author.name}</h1>
            <p className="text-gray-600">{author.nationality} • Nacido en {author.birthYear}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              ← Volver al Dashboard
            </button>
            <button
              onClick={() => {
                setEditFormData({
                  name: author.name,
                  email: author.email,
                  nationality: author.nationality,
                  birthYear: author.birthYear.toString(),
                  bio: author.bio || '',
                });
                setShowEditForm(!showEditForm);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Editar Autor
            </button>
          </div>
        </div>

        {/* Formulario de Edición */}
        {showEditForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-yellow-500">
            <h2 className="text-xl font-bold mb-4">Editar Información del Autor</h2>
            <form onSubmit={handleEditAuthor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="Nacionalidad"
                required
                value={editFormData.nationality}
                onChange={(e) => setEditFormData({ ...editFormData, nationality: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="number"
                placeholder="Año de Nacimiento"
                required
                value={editFormData.birthYear}
                onChange={(e) => setEditFormData({ ...editFormData, birthYear: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                placeholder="Biografía"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                  Guardar Cambios
                </button>
                <button type="button" onClick={() => setShowEditForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Biografía */}
        {author.bio && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Biografía</h2>
            <p className="text-gray-700 leading-relaxed">{author.bio}</p>
          </div>
        )}

        {/* Estadísticas */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas Literarias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Libros</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Promedio de Páginas</h3>
                <p className="text-3xl font-bold text-green-600">{stats.averagePages}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Primer Libro</h3>
                <p className="text-lg font-semibold text-gray-900">{stats.firstBook?.title || 'N/A'}</p>
                <p className="text-sm text-gray-500">{stats.firstBook?.year || ''}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Último Libro</h3>
                <p className="text-lg font-semibold text-gray-900">{stats.latestBook?.title || 'N/A'}</p>
                <p className="text-sm text-gray-500">{stats.latestBook?.year || ''}</p>
              </div>
            </div>
            
            {/* Géneros y Libros Extremos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Géneros que escribe</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.genres.map((g, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Libro más largo / más corto</h3>
                <p className="text-sm text-gray-700">
                  📗 <strong>Más largo:</strong> {stats.longestBook?.title} ({stats.longestBook?.pages} págs)
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  📕 <strong>Más corto:</strong> {stats.shortestBook?.title} ({stats.shortestBook?.pages} págs)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Libros */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Obras Publicadas ({books.length})</h2>
            <button
              onClick={() => setShowAddBookForm(!showAddBookForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              + Agregar Nuevo Libro
            </button>
          </div>

          {/* Formulario para agregar libro */}
          {showAddBookForm && (
            <div className="p-6 bg-blue-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Nuevo libro para {author.name}</h3>
              <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título *"
                  required
                  value={newBookData.title}
                  onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="ISBN *"
                  required
                  value={newBookData.isbn}
                  onChange={(e) => setNewBookData({ ...newBookData, isbn: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Año de Publicación *"
                  required
                  value={newBookData.publishedYear}
                  onChange={(e) => setNewBookData({ ...newBookData, publishedYear: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Género *"
                  required
                  value={newBookData.genre}
                  onChange={(e) => setNewBookData({ ...newBookData, genre: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Número de Páginas *"
                  required
                  value={newBookData.pages}
                  onChange={(e) => setNewBookData({ ...newBookData, pages: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Descripción (opcional)"
                  value={newBookData.description}
                  onChange={(e) => setNewBookData({ ...newBookData, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 md:col-span-2"
                />
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Guardar Libro
                  </button>
                  <button type="button" onClick={() => setShowAddBookForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Libros */}
          {books.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Este autor aún no tiene libros registrados. ¡Agrega el primero!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {books.map((book) => (
                <div key={book.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>📅 {book.publishedYear}</span>
                        <span>📚 {book.genre}</span>
                        <span>📄 {book.pages} páginas</span>
                        <span>🔖 ISBN: {book.isbn}</span>
                      </div>
                      {book.description && (
                        <p className="text-sm text-gray-600 mt-2 italic">{book.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}