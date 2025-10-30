"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { FFLeagueAbi } from "@/abi/FFLeague";
import { CONTRACTS } from "@/lib/contracts";

const schema = z.object({
	name: z.string().min(2, "Nombre requerido"),
	location: z.string().min(2, "Ubicación requerida"),
	category: z.string().min(1, "Categoría requerida")
});

type FormValues = z.infer<typeof schema>;

export default function CrearLigaPage() {
	const { register, handleSubmit, reset, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
	const { writeContract, data: hash, isPending, error } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	const onSubmit = async (v: FormValues) => {
		writeContract({
			address: CONTRACTS.FFLeague as `0x${string}`,
			abi: FFLeagueAbi,
			functionName: "createLeague",
			args: [v.name, v.location, v.category]
		});
		reset();
	};

	return (
		<main className="space-y-4">
			<h1 className="text-2xl font-bold">Crear nueva liga</h1>
			<p className="text-sm text-slate-600">
				Ingresa los datos de la liga. Debes tener el rol <code>LEAGUE_ROLE</code>.
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-3 rounded-2xl bg-white p-5 shadow">
				<div>
					<label className="block text-sm font-medium">Nombre</label>
					<input className="input" placeholder="Liga ADBChile" {...register("name")} />
					{formState.errors.name ? <p className="text-red-500 text-xs">{formState.errors.name.message}</p> : null}
				</div>
				<div>
					<label className="block text-sm font-medium">Ubicación</label>
					<input className="input" placeholder="San Bernardo" {...register("location")} />
					{formState.errors.location ? <p className="text-red-500 text-xs">{formState.errors.location.message}</p> : null}
				</div>
				<div>
					<label className="block text-sm font-medium">Categoría</label>
					<select className="select" defaultValue="" {...register("category")}>
						<option value="" disabled>Selecciona una categoría</option>
						<option value="Junior">Junior</option>
						<option value="Honor">Honor</option>
						<option value="Serie">Serie</option>
						<option value="Super Senior">Super Senior</option>
						<option value="Juvenil">Juvenil</option>
						<option value="Infantil">Infantil</option>
						<option value="Universitaria">Universitaria</option>
						<option value="Dorado">Dorado</option>
						<option value="Platino">Platino</option>
						<option value="Viejos Crack">Viejos Crack</option>
					</select>
					{formState.errors.category ? <p className="text-red-500 text-xs">{formState.errors.category.message}</p> : null}
				</div>
				<button type="submit" className="btn" disabled={isPending || isLoading}>
					{isPending ? "Firmando…" : isLoading ? "Enviando…" : isSuccess ? "Creada" : "Crear liga"}
				</button>
				{error ? <p className="text-red-500 text-xs">{String(error.message || error)}</p> : null}
			</form>
		</main>
	);
}


