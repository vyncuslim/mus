import { redirect } from "next/navigation";
// Keep existing localStorage untouched while removing the separate study UI.
export default function FavoritesPage() { redirect("/"); }
