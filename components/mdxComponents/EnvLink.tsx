export default function EnvLink({ path, children }: { path: string; children: React.ReactNode }) {
  return <a href={path}>{children}</a>
}
