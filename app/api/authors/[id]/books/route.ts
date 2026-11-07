import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener libros de un autor específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar primero si el autor existe
    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    // Buscar los libros asociados a ese authorId
    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: {
        publishedYear: 'asc',
      },
    });

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener los libros del autor' },
      { status: 500 }
    );
  }
}