import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// ✅ GET single movie
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = Number(params.id)
		const { data, error } = await supabase
			.from("movies")
			.select("id, title, year, status")
			.eq("id", id)
			.single()

		if (error?.code === "PGRST116") {
			return NextResponse.json({ error: "Movie not found" }, { status: 404 })
		}
		if (error) throw error
		return NextResponse.json(data)
	} catch (error) {
		console.error("Error fetching movie:", error)
		return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 })
	}
}

// ✅ PUT update movie
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = Number(params.id)
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

		const { error } = await supabase
			.from("movies")
			.update({ title: title.trim(), year, status })
			.eq("id", id)

		if (error) throw error
		return NextResponse.json({ message: "Movie updated successfully" })
	} catch (error) {
		console.error("Error updating movie:", error)
		return NextResponse.json({ error: "Failed to update movie" }, { status: 500 })
	}
}

// ✅ DELETE movie
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = Number(params.id)
		const { error } = await supabase
			.from("movies")
			.delete()
			.eq("id", id)

		if (error) throw error
		return NextResponse.json({ message: "Movie deleted successfully" })
	} catch (error) {
		console.error("Error deleting movie:", error)
		return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 })
	}
}
