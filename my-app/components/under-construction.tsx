interface UnderConstructionProps {
  title: string
  message?: string
}

export function UnderConstruction({ title, message = "This page is under construction." }: UnderConstructionProps) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </section>
  )
}
