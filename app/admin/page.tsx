import { redirect } from 'next/navigation';

/** `/admin` has no UI — send visitors to the login screen. */
export default function AdminPage() {
  redirect('/admin/login');
}
