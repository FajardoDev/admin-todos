This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## tecnologías Nextjs, TailwindCss, React entre otras

## Configuraciones iniciales

```
npx create-next-app@latest nombre-del-proyecto
vamos a trabajar con NextAPIRoutes y vamos a crear una RESTfull Api

1- En el app crear una carpeta api/todos/route.ts 'localhost:3000/api/todos'

## Crear una base de datos Real con Postgrest

1- levantar el demonio de docker y ver docker --version
2- En VC code raiz crear docker-compose.yml, son las intruciones para subir img

version: '3'

services:
  todosDB:
    image: postgres:15.3
    container_name: todos-db
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - ./postgres:/var/lib/postgresql/data

3- ir a la terminal del project levantar la base de datos... docker compose up -d ver en docker
4- Ir la TablePlus darle a + y llenar ver en vc code la carpeta

## Configuracion para con prisma en https://vercel.com/guides/nextjs-prisma-postgres
1- en la terminal del proyecto instalar prisma... npx prisma init ver el archivo .env
2- copiar todo el .env y pegarlo fuera de otra carpeta con el nombre .env.template

en la carpeta de prisma en schema.prisma crear el modelo

model Todo {
  id          String   @id @default(uuid())
  description String
  complete    Boolean  @default(false)
  createAt    DateTime @default(now())
  updateAt    DateTime @updatedAt
}

3- crear una migración npx prisma migrate dev name dev ir a TablePlus y ver el name del model
4- generar el client de prisma para hacer manipulación con la db npx prisma generate
5- La recomendación de Next en src crear lib/prisma.ts

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!(global as any).prisma) {
		(global as any).prisma = new PrismaClient();
	}
	prisma = (global as any).prisma;
}

export default prisma;

## Creación de la base de datos local en ver en Postman y luego en TablePlus
1- /api/seed/route.ts en vc code en postman (localhost:3000/api/seed)

## crear un endpoint de los todos y que le podamos mandar argumentos
(localhost:3000/api/todos)

export async function GET(req: Request) {
	const todos = await prisma.todo.findMany();

	return NextResponse.json(todos); ver todos los todos en postmam
}

## Paginación sencilla take= toma 2 skip = saltarme (localhost:3000/api/todos?take=2&skip=2)

configuración del take y el skip
export async function GET(request: Request) {
	// Paginación simple
	const { searchParams } = new URL(request.url);

	const take = Number(searchParams.get("take") ?? 10);
	const skip = Number(searchParams.get("skip") ?? 0);

	if (isNaN(take)) {
		return NextResponse.json(
			{ message: "Take tiene que ser un número" },
			{ status: 400 },
		);
	}
	if (isNaN(skip)) {
		return NextResponse.json(
			{ message: "Skip tiene que ser un número" },
			{ status: 400 },
		);
	}

	const todos = await prisma.todo.findMany({
		take: take,
		skip: skip,
	});

	return NextResponse.json(todos);
}

## Retornar una única entrada (localhost:3000/api/todos/c6502216-b54d-4d36-9644-ab69649ccf16)
ir y crear [id] en todos

export async function GET(request: Request, { params }: Segments) {
	// console.log(segments); { params: { id: 'c6502216-b54d-4d36-9644-ab69649ccf16' } }

	const { id } = params;

	const todo = await prisma.todo.findFirst({ where: { id } });
	if (!todo) {
		return NextResponse.json(
			{ message: `todo con el id: ${id} no existe` },
			{ status: 404 },
		);
	}

	return NextResponse.json(todo);
}

## POST Crear una nueva entrada

Ir a Postman Body => raw => JSON y escribir
    {"hola": "Mundo!!!"}
    {
      "description": "Conquistar el Mundo!!!",
      "complete": true
    }

export async function POST(request: Request) {
	const body = await request.json();

	const todo = await prisma.todo.create({ data: body });

	return NextResponse.json(todo);
}

## Yup validación de schema sigue el POST para validar los campos un POST(localhost:3000/api/todos)
npm i yup

En Postman
{
    "description": "Aprendiendo Next!!!",
    "complete": true,
    "createAt": "6 junio 2024"
}
para poner un breipoint
{
    "description": "Aprendiendo Next!!!",
    "complete": "true",
    "otraPropiedad": 12727722

}
{
    "name": "PrismaClientValidationError",
    "clientVersion": "5.11.0"
}

## Asi luce el POST
export async function POST(request: Request) {
	try {
		// obj a validar body
		const { complete, description } = await postSchema.validate(
			await request.json(),
		);
		// const body = await postSchema.validate(await request.json());

		const todo = await prisma.todo.create({ data: { complete, description } });
		// const todo = await prisma.todo.create({ data: body });

		return NextResponse.json(todo);
	} catch (error) {
		return NextResponse.json(error, { status: 400 });
	}
}


## PUT Actualizar entradas
Ir a PostMan hacer una petición PUT a (localhost:3000/api/todos/8d77be7c-435f-4cef-8ff9-da653906b78d)
Body => raw => JSON {  "description": "Desde el endpoint", "complete": "true" }

// Method PUT
export async function PUT(request: Request, { params }: Segments) {
	const { id } = params;

	const todo = await prisma.todo.findFirst({ where: { id } });
	if (!todo) {
		return NextResponse.json(
			{ message: `todo con el id: ${id} no existe` },
			{ status: 404 },
		);
	}

	const body = await request.json();

	const updateTodo = await prisma.todo.update({
		where: { id },
		data: { ...body },
		// data: body,
	});

	// return NextResponse.json(todo);
	return NextResponse.json(updateTodo);
}

Ver en postman
{
    "description": "Esta actualización funcionó correctamente",
    "complete": true
}

result
{
    "id": "8d77be7c-435f-4cef-8ff9-da653906b78d",
    "description": "Esta actualización funcionó correctamente",
    "complete": true,
    "createAt": "2024-03-19T14:45:08.912Z",
    "updateAt": "2024-03-20T16:20:33.542Z"
}

##Trabajar en la duplicidad del código del [id] GET & PUT
```

## Development

Pasos para levantar la app en desarrollo:

1. Levantar la base de datos

   ```
   docker compose up -d

   ```

2. Crear una copia de el .env.template y renombrarlo a .env
3. Reemplazar las variables de entorno
4. Ejecutar el comando npm install para reconstruir los módulos de node
5. Ejecutar el comando npm run dev para ejecutar aplicación en desarrollo
6. Ejecutar estos comandos de Prisma

   ```
   npx prisma migrate dev
   npx prisma generate

   ```

7. Ejecutar el SEED para crear la base de datos local

## Prisma commnads

    ```

    npx prisma init
    npx prisma migrate dev
    npx prisma generate

    ```
