import { useParams } from "react-router-dom";

export default function EditListingPage() {
  const { id } = useParams();
  return <div className="rounded border bg-white p-4">Edit listing {id}</div>;
}
