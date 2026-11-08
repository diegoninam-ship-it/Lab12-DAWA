'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  description?: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  pages: number;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
}

interface Author {
  id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Filtros
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
    authorId: '',
  });

  // Cargar autores al montar
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Cargar libros cuando cambien los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300); // Debounce de 300ms para búsqueda en tiempo real

    return () => clearTimeout(timer);
  }, [search, genre, authorName, sortBy, order, page]);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
        // Extraer géneros únicos de todos los libros
        fetchAllBooksForGenres();
      }
    } catch (error) {
      console.error('Error al cargar autores:', error);
    }
  };

  const fetchAllBooksForGenres = async () => {
  try {
    const response = await fetch('/api/books');
    if (response.ok) {
      const data: Book[] = await response.json();
      const uniqueGenres: string[] = [...new Set(data.map((book) => book.genre))];
      setGenres(uniqueGenres);
    }
  } catch (error) {
    console.error('Error al cargar géneros:', error);
  }
};

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (authorName) params.append('authorName', authorName);
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());
      params.append('sortBy', sortBy);
      params.append('order', order);

      const response = await fetch(`/api/books/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error al cargar libros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBook ? `/api/books/${editingBook.id}` : '/api/books';
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedYear: parseInt(formData.publishedYear),
          pages: parseInt(formData.pages),
        }),
      });

      if (response.ok) {
        await fetchBooks();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar el libro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el libro');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description || '',
      isbn: book.isbn,
      publishedYear: book.publishedYear.toString(),
      genre: book.genre,
      pages: book.pages.toString(),
      authorId: book.authorId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBooks();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar el libro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el libro');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isbn: '',
      publishedYear: '',
      genre: '',
      pages: '',
      authorId: '',
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const clearFilters = () => {
    setSearch('');
    setGenre('');
    setAuthorName('');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Búsqueda de Libros
          </h1>
          <p className="text-gray-600">Busca, filtra y gestiona libros</p>
        </div>

        {/* Botón para crear libro */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Crear Nuevo Libro
          </button>
          <a
            href="/"
            className="ml-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Volver al Dashboard
          </a>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingBook ? 'Editar Libro' : 'Crear Nuevo Libro'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año de Publicación *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Páginas *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autor *
                  </label>
                  <select
                    required
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar autor</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingBook ? 'Actualizar' : 'Crear'}
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

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Filtros de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por título
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Ej: Cien años..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por género
              </label>
              <select
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los géneros</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por autor
              </label>
              <select
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los autores</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Fecha de creación</option>
                <option value="title">Título</option>
                <option value="publishedYear">Año de publicación</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium w-full"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Resultados ({pagination.total} libros encontrados)
            </h2>
            <span className="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="text-xl text-gray-500">Cargando libros...</div>
            </div>
          ) : books.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No se encontraron libros con los filtros aplicados.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {books.map((book) => (
                <div key={book.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        por <span className="font-medium">{book.author.name}</span>
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>📅 {book.publishedYear}</span>
                        <span>📚 {book.genre}</span>
                        <span>📄 {book.pages} páginas</span>
                        <span>🔖 ISBN: {book.isbn}</span>
                      </div>
                      {book.description && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {book.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
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

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}