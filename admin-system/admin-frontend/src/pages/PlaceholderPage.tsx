type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p>模块建设中，已完成路由和权限框架。</p>
    </section>
  );
}
