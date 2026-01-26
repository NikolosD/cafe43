import LoginForm from './LoginForm';

export default function AdminLoginPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    // Auth redirect is now handled in middleware.ts
    return <LoginForm locale={locale} />;
}
