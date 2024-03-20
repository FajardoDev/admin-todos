// import { FormatearFecha } from "@/helpers/FormatearFecha";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// Pulgar ó borrar la base de datos
// await prisma.todo.deleteMany({ where: { complete: true } }); exepto los terminados delete * from todo

// const todos = await prisma.todo.create({
// 	data: { description: "Piedra del alma", complete: true },
// });

// console.log(todos);
// console.log(FormatearFecha(todos.createAt));

export async function GET(request: Request) {
	await prisma.todo.deleteMany();

	await prisma.todo.createMany({
		data: [
			{ description: "La piedra del alma", complete: true },
			{ description: "La piedra del poder" },
			{ description: "La piedra del tiempo" },
			{ description: "La piedra del espacio" },
			{ description: "La piedra del realidad" },
		],
	});

	return NextResponse.json({
		message: "Seed Executed",
		method: "GET",
	});
}
