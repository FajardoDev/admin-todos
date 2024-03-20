export const FormatearFecha = (fecha: any): Date => {
	const newFecha = new Date(fecha);
	const opciones: {} = {
		year: "numeric",
		month: "long",
		day: "2-digit",
	};
	const fechaFormateada = newFecha.toLocaleDateString("es-ES", opciones); // Formatear la fecha
	return new Date(fechaFormateada); // Devolver un objeto Date formateado
};
