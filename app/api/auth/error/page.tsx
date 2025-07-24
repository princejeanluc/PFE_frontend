// pages/api/auth/error.tsx
import { useRouter } from 'next/router';

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div>
      <h1>Erreur d'authentification</h1>
      <p>Erreur : {error}</p>
      <p>
        Consulte la documentation NextAuth pour comprendre le message. <br />
        <a href="https://next-auth.js.org/errors" target="_blank" rel="noopener noreferrer">
          Voir les erreurs NextAuth
        </a>
      </p>
    </div>
  );
}
