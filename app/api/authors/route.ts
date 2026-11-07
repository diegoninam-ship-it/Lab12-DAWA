import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Listar todos los autores
export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: {
        birthYear: 'asc',
      },
    });
    return NextResponse.json(authors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener los autores' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo autor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, nationality, birthYear, bio } = body;

    // Validación básica
    if (!name || !email || !nationality || !birthYear) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (name, email, nationality, birthYear)' },
        { status: 400 }
      );
    }

    const newAuthor = await prisma.author.create({
      data: {
        name,
        email,
        nationality,
        birthYear: parseInt(birthYear),
        bio: bio || null,
      },
    });

    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear el autor' },
      { status: 500 }
    );
  }
}