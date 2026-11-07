import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Listar todos los libros (con filtro opcional por género)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');

    // Construir la consulta con filtro opcional
    const whereClause = genre ? { genre } : {};

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        author: true, // Incluir información del autor
      },
      orderBy: {
        publishedYear: 'desc',
      },
    });

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener los libros' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo libro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

    // Validación básica
    if (!title || !isbn || !publishedYear || !genre || !pages || !authorId) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (title, isbn, publishedYear, genre, pages, authorId)' },
        { status: 400 }
      );
    }

    // Verificar que el autor existe
    const authorExists = await prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      return NextResponse.json(
        { error: 'El autor especificado no existe' },
        { status: 404 }
      );
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        description: description || null,
        isbn,
        publishedYear: parseInt(publishedYear),
        genre,
        pages: parseInt(pages),
        authorId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error: any) {
    // Error de ISBN duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un libro con ese ISBN' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear el libro' },
      { status: 500 }
    );
  }
}