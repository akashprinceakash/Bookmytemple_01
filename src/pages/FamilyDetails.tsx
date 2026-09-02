import { useState, useEffect } from "react";
// import type { Page } from "../App";
import { api } from "../api/client";
import { useNavigate, useLocation } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Crumb, SectionHead } from '../components/royale';

interface FamilyMember {
  id:any,
  firstName: string;
  lastName: string;
  relationship: string;
  nakshatra: string;
}

// interface FamilyDetailsProps {
//   navigate: (page: Page, data?: any) => void;
// }

export function FamilyDetails() {
    
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [family, setFamily] = useState<FamilyMember[]>([
    {
      id:"",
      firstName: "",
      lastName: "",
      relationship: "",
      nakshatra: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);


  const handleChange = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    const updated = [...family];
    updated[index][field] = value;
    setFamily(updated);
  };


  const addMember = () => {
    setFamily((prev) => [
      ...prev,
      {
        id:null,
        firstName: "",
        lastName: "",
        relationship: "",
        nakshatra: "",
      },
    ]);
  };

  // -----------------------------
  // Remove member
  // -----------------------------
  const removeMember = (index: number) => {
    setFamily((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------------
  // Load data
  // -----------------------------
  useEffect(() => {
    setLoading(true);

    api
      .get("api/user/family")
      .then((res) => {
        const data = res.data;

        if (Array.isArray(data) && data.length > 0) {
          setFamily(data);
          setIsEditing(false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const isValid = family.every(
    (m) => m.firstName.trim() !== "" && m.relationship.trim() !== ""
  );

  const handleSave = () => {
    if (!isValid) {
      alert("First Name and Relationship are required");
      return;
    }

    setSaving(true);

    const payload = family.map((member) => ({
      id: member?.id,
      firstName: member.firstName,
      lastName: member.lastName,
      relationship: member.relationship,
      nakshatra: member.nakshatra,
    }));

    api
      .post("api/user/family", payload)
      .then(() => {
        setIsEditing(false);
        // navigate("/profile");

        if (from) {
          navigate(from);
        } else {
          navigate("/profile");
        }

      })
      .finally(() => setSaving(false));
  };

  return (
    <PageShell>
      <Crumb
        parts={[
          { label: 'Home', to: '/home' },
          { label: 'Profile', to: '/profile' },
          { label: 'My Family' },
        ]}
      />

      <SectionHead
        tag="Your Sankalpa"
        title="My Family"
        lede="Add the family members whose names and nakshatras should be included in the sankalpa."
      />

      <div className="space-y-[18px]">
        {loading && <p className="py-8 text-center text-muted-foreground">Loading family...</p>}

        {!loading && (
          <>
            {/* Family Cards */}
            {family.map((member, index) => (
              <div
                key={index}
                className="card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="tag" style={{ marginBottom: 0 }}>Member {index + 1}</span>

                  {family.length > 1 && isEditing && (
                    <button
                      onClick={() => removeMember(index)}
                      className="text-[13px] text-destructive transition-colors hover:text-gold-soft"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid2">
                <div className="field">
                  <label>First Name *</label>
                  <input
                    placeholder="First Name"
                    value={member.firstName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleChange(index, "firstName", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input
                    placeholder="Last Name"
                    value={member.lastName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleChange(index, "lastName", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Relationship *</label>
                  <input
                    placeholder="Relationship"
                    value={member.relationship}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleChange(index, "relationship", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Nakshatra</label>
                  <input
                    placeholder="Nakshatra"
                    value={member.nakshatra}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleChange(index, "nakshatra", e.target.value)
                    }
                  />
                </div>
                </div>
              </div>
            ))}

            {/* Add Member */}
            {isEditing && (
              <button
                onClick={addMember}
                className="w-full rounded-[18px] border border-dashed border-gold/50 py-4 text-sm font-semibold text-gold-soft transition-colors hover:border-gold hover:bg-gold/5"
              >
                + Add Family Member
              </button>
            )}

            {/* Save / Edit Buttons */}
            <div className="mt-2 flex flex-wrap gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary shimmer flex-1"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary shimmer w-full"
                >
                  Add/Edit Family
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}