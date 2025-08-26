import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// ✅ GET all movies from Supabase
export async function GET() {
	try {
		const { data, error } = await supabase
			.from("movies")
			.select("id, title, year, status")
			.order("id", { ascending: false })

		if (error) throw error
		return NextResponse.json(data ?? [])
	} catch (error) {
		console.error("Error fetching movies:", error)
		return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
	}
}

// ✅ POST add a new movie to Supabase
export async function POST(request: NextRequest) {
	try {
		const { title, year, status } = await request.json()

		if (!title?.trim()) {
			return NextResponse.json({ error: "Title is required" }, { status: 400 })
		}
		if (!year || year < 1900 || year > new Date().getFullYear() + 5) {
			return NextResponse.json({ error: "Valid year is required" }, { status: 400 })
		}
		if (!status || !["watched", "unwatched"].includes(status)) {
			return NextResponse.json({ error: "Valid status is required" }, { status: 400 })
		}

		const { data, error } = await supabase
			.from("movies")
			.insert({ title: title.trim(), year, status })
			.select("id")
			.single()

		if (error) throw error
		return NextResponse.json({ message: "Movie added successfully", id: data?.id }, { status: 201 })
	} catch (error) {
		console.error("Error adding movie:", error)
		return NextResponse.json({ error: "Failed to add movie" }, { status: 500 })
	}
}
