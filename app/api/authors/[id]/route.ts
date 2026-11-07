import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener autor por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(author, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el autor' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar autor por ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, nationality, birthYear, bio } = body;

    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: {
        name: name || undefined,
        email: email || undefined,
        nationality: nationality || undefined,
        birthYear: birthYear ? parseInt(birthYear) : undefined,
        bio: bio || undefined,
      },
    });

    return NextResponse.json(updatedAuthor, { status: 200 });
  } catch (error: any) {
    // Si el error es que no se encontró el registro
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Autor no encontrado para actualizar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualizar el autor' },
      { status: 500 }
    );
  }
}