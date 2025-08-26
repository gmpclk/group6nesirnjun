import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
	try {
		const { data, error } = await supabase
			.from("movies")
			.select("id, title, year, status")
			.order("id", { ascending: false })

		if (error) throw error
		if (!data || data.length === 0) {
			return NextResponse.json({ error: "No movie watchlist found" }, { status: 404 })
		}

		return new NextResponse(JSON.stringify(data, null, 2), {
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": "attachment; filename=movies.json",
			},
		})
	} catch (error) {
		console.error("Error exporting movies:", error)
		return NextResponse.json({ error: "Failed to export movies" }, { status: 500 })
	}
}
