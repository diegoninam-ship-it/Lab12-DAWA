import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET: Búsqueda de libros con paginación, filtros y ordenamiento
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Extraer y validar query parameters
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const authorName = searchParams.get('authorName') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    // 2. Validar campo de ordenamiento permitido
    const validSortFields = ['title', 'publishedYear', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // 3. Construir cláusula WHERE dinámica
    const whereClause: Prisma.BookWhereInput = {};

    // Filtro por búsqueda en título (case-insensitive, parcial)
    if (search) {
      whereClause.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filtro por género exacto
    if (genre) {
      whereClause.genre = genre;
    }

    // Filtro por nombre de autor (case-insensitive, parcial)
    if (authorName) {
      whereClause.author = {
        name: {
          contains: authorName,
          mode: 'insensitive',
        },
      };
    }

    // 4. Calcular offset para paginación
    const skip = (page - 1) * limit;

    // 5. Ejecutar consulta con paginación
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        include: {
          author: true,
        },
        orderBy: {
          [sortField]: order,
        },
        skip,
        take: limit,
      }),
      prisma.book.count({
        where: whereClause,
      }),
    ]);

    // 6. Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // 7. Devolver respuesta estructurada
    return NextResponse.json(
      {
        data: books,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en búsqueda de libros:', error);
    return NextResponse.json(
      { error: 'Error al buscar libros' },
      { status: 500 }
    );
  }
}