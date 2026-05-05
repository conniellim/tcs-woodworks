import Image from 'next/image'
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
            Established in 2001, The Carpenter&apos;s Son is proud to serve the Bay Area with
            high-quality custom cabinetry and carpentry backed by over three generations of master
            craftsmanship. We are client-oriented from the very first conversation to the final walkthrough.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-stone">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'We Listen First', body: 'Providing good service means taking the time to listen. Patience is a requirement to understanding the desired outcome — we never skip this step.' },
              { title: 'Attention to Detail', body: 'Attention to detail is a major contributor to our production. Every cut, joint, and finish is executed with the precision the work demands.' },
              { title: 'Client-Oriented', body: 'We will work with you every step of the way to make sure you receive the services you need and a product that fits your environment perfectly.' },
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
                  <div className="relative w-20 h-20 rounded-full bg-stone-muted mx-auto mb-4 overflow-hidden">
                    {member.avatar_url && (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        sizes="80px"
                        className="w-full h-full object-cover"
                      />
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
