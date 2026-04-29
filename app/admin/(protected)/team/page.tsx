import { supabaseAdmin } from '@/lib/supabase-admin'
import { createTeamMember, deleteTeamMember } from './actions'

export default async function TeamPage() {
  const { data: team } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .order('name')

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-black text-forest mb-2">Team Members</h1>
      <p className="text-sm text-sage-dark mb-8">Team members can be assigned to bookings and appear on the About page.</p>

      <div className="bg-white border border-stone-border rounded p-6 mb-8">
        <h2 className="font-bold text-forest mb-4">Add Team Member</h2>
        <form action={createTeamMember} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-forest mb-1">Name</label>
              <input name="name" required className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-forest mb-1">Role / Title</label>
              <input name="role" className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" placeholder="e.g. Lead Carpenter" />
            </div>
          </div>
          <button type="submit" className="bg-forest text-stone px-4 py-2 rounded text-sm font-semibold hover:bg-forest-light transition-colors">
            Add Member
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {(team ?? []).length === 0 && (
          <p className="text-sage-dark text-center py-12">No team members yet.</p>
        )}
        {(team ?? []).map((member) => (
          <div key={member.id} className="bg-white border border-stone-border rounded p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center text-sm font-bold text-sage">
                {member.name[0]}
              </div>
              <div>
                <p className="font-semibold text-forest">{member.name}</p>
                <p className="text-xs text-sage-dark">{member.role}</p>
              </div>
            </div>
            <form action={deleteTeamMember.bind(null, member.id)}>
              <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-semibold"
                onClick={(e) => { if (!confirm(`Remove ${member.name} from the team?`)) e.preventDefault() }}>
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
