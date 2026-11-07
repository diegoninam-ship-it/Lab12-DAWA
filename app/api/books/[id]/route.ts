import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener libro por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el libro' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar libro por ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

    // Si se está actualizando el autor, verificar que existe
    if (authorId) {
      const authorExists = await prisma.author.findUnique({
        where: { id: authorId },
      });

      if (!authorExists) {
        return NextResponse.json(
          { error: 'El autor especificado no existe' },
          { status: 404 }
        );
      }
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        isbn: isbn || undefined,
        publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
        genre: genre || undefined,
        pages: pages ? parseInt(pages) : undefined,
        authorId: authorId || undefined,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Libro no encontrado para actualizar' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un libro con ese ISBN' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar el libro' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar libro por ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Libro eliminado correctamente' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Libro no encontrado para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al eliminar el libro' },
      { status: 500 }
    );
  }
}