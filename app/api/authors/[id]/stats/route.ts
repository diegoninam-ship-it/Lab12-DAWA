import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener estadísticas completas de un autor
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verificar que el autor existe y obtener sus libros
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            publishedYear: 'asc',
          },
        },
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    // 2. Si el autor no tiene libros, devolver estadísticas vacías
    if (author.books.length === 0) {
      return NextResponse.json(
        {
          authorId: author.id,
          authorName: author.name,
          totalBooks: 0,
          firstBook: null,
          latestBook: null,
          averagePages: 0,
          genres: [],
          longestBook: null,
          shortestBook: null,
        },
        { status: 200 }
      );
    }

    // 3. Calcular estadísticas
    const totalBooks = author.books.length;

    // Primer y último libro (ya están ordenados por publishedYear asc)
    const firstBook = {
      title: author.books[0].title,
      year: author.books[0].publishedYear,
    };

    const latestBook = {
      title: author.books[author.books.length - 1].title,
      year: author.books[author.books.length - 1].publishedYear,
    };

    // Promedio de páginas
    const totalPaginas = author.books.reduce((sum, book) => sum + book.pages, 0);
    const averagePages = Math.round(totalPaginas / totalBooks);

    // Géneros únicos
    const genres = [...new Set(author.books.map((book) => book.genre))];

    // Libro con más páginas
    const longestBook = author.books.reduce((max, book) =>
      book.pages > max.pages ? book : max
    );

    // Libro con menos páginas
    const shortestBook = author.books.reduce((min, book) =>
      book.pages < min.pages ? book : min
    );

    // 4. Devolver respuesta estructurada
    return NextResponse.json(
      {
        authorId: author.id,
        authorName: author.name,
        totalBooks,
        firstBook,
        latestBook,
        averagePages,
        genres,
        longestBook: {
          title: longestBook.title,
          pages: longestBook.pages,
        },
        shortestBook: {
          title: shortestBook.title,
          pages: shortestBook.pages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener estadísticas del autor:', error);
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas del autor' },
      { status: 500 }
    );
  }
}