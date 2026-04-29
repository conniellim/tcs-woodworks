import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

export default async function AboutPage() {
  const { data: team } = await supabase
    .from('team_members')
    .select('*')

  return (
    <div>
      <section className="bg-forest py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel light>Our Story</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-black text-stone tracking-tight mt-2 mb-6">
            A Family Trade, Perfected Over Generations
          </h1>
          <p className="text-sage text-lg leading-relaxed">
            The Carpenter&apos;s Son was founded on a simple belief: that great work speaks for itself.
            Based in Hayward, CA, we&apos;ve been building custom carpentry and construction projects
            for Bay Area families and businesses since 2005.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-stone">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Craftsmanship', body: "Every cut, joint, and finish is executed with precision. We don't rush. We don't cut corners." },
              { title: 'Transparency', body: 'Clear estimates, honest timelines, and direct communication from first call to final walkthrough.' },
              { title: 'Longevity', body: 'We build things that last decades, not years. Materials, methods, and workmanship chosen for the long run.' },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="text-lg font-black text-forest mb-3">{title}</h3>
                <p className="text-sage-deeper leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team && team.length > 0 && (
        <section className="py-20 px-6 bg-stone-mid">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>The Team</SectionLabel>
              <h2 className="text-3xl font-black text-forest tracking-tight">People Behind the Work</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-stone-muted mx-auto mb-4 overflow-hidden">
                    {member.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-bold text-forest">{member.name}</h3>
                  <p className="text-sm text-sage-dark">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-stone text-center">
        <h2 className="text-2xl font-black text-forest mb-4">Let&apos;s Build Something Together</h2>
        <Button href="/book" size="lg">Schedule a Free Consultation</Button>
      </section>
    </div>
  )
}
