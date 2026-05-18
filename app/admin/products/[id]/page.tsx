import { redirect } from 'next/navigation';

type PageProps = { params: { id: string } };

/** Product detail lives at `/admin/products/[id]/edit`. */
export default function AdminProductRedirectPage({ params }: PageProps) {
  redirect(`/admin/products/${params.id}/edit`);
}
