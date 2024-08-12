"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { motion } from "framer-motion";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  profile_picture_url?: string;
}

interface KycData {
  idType: string;
  idPhoto: File | null;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycData, setKycData] = useState<KycData>({
    idType: "",
    idPhoto: null,
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setUser(data);
        } else {
          console.error(error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(`public/${user.id}/${file.name}`, file);

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(`public/${user.id}/${file.name}`);
        const publicURL = publicUrlData?.publicUrl;

        if (publicURL) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ profile_picture_url: publicURL })
            .eq("id", user.id);

          if (!updateError) {
            setUser({ ...user, profile_picture_url: publicURL });
          } else {
            console.error(updateError);
          }
        } else {
          console.error("Failed to get public URL");
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleKycSubmit = async () => {
    const { idType, idPhoto } = kycData;
    if (idPhoto && user) {
      const { data, error } = await supabase.storage
        .from("kyc-documents")
        .upload(`public/${user.id}/${idPhoto.name}`, idPhoto);

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("kyc-documents")
          .getPublicUrl(`public/${user.id}/${idPhoto.name}`);
        const publicURL = publicUrlData?.publicUrl;

        if (publicURL) {
          const { error: insertError } = await supabase.from("kyc").insert({
            user_id: user.id,
            id_type: idType,
            id_photo_url: publicURL,
          });

          if (!insertError) {
            setKycModalOpen(false);
          } else {
            console.error(insertError);
          }
        } else {
          console.error("Failed to get public URL");
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleFieldChange = async () => {
    if (editableField && user) {
      const updates: Partial<User> = {
        [editableField]: fieldValue,
      };

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (!error) {
        setUser({ ...user, [editableField]: fieldValue });
        setEditableField(null);
        setFieldValue("");
      } else {
        console.error(error);
      }
    }
  };

  const handleFieldEdit = (field: keyof User) => {
    setEditableField(field);
    setFieldValue(user?.[field] || "");
  };

  const handleKycDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setKycData({
      ...kycData,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div className="h-full flex justify-center items-center bg-white py-[5rem] px-[2rem]">
      <div className="w-full max-w-md bg-white border border-black h-full rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <motion.img
              src={
                user?.profile_picture_url ||
                "https://imgs.search.brave.com/t7_5MGpiska85f_Q1XjshZgZpbWvMQtugDmVUxLj2EE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8yMS8yMy9h/dmF0YXItcGhvdG8t/ZGVmYXVsdC11c2Vy/LWljb24tcGVyc29u/LWltYWdlLXZlY3Rv/ci00Nzg1MjEyMy5q/cGc"
              }
              alt="Profile Picture"
              className="w-24 h-24 rounded-full object-cover"
            />
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleProfilePicChange}
            />
          </div>
          <Button
            onClick={() =>
              (
                document.querySelector('input[type="file"]') as HTMLInputElement
              )?.click()
            }
          >
            Update Profile Picture
          </Button>
        </div>
        <div className="space-y-4">
          {["first_name", "last_name", "email", "phone_number", "country"].map(
            (field) => (
              <div
                key={field}
                className="flex space-x-2 mb-4 items-center justify-center"
              >
                <div className="flex-1">
                  <Label htmlFor={field} className="text-black">
                    {capitalizeFirstLetter(field.replace("_", " "))}
                  </Label>
                  <Input
                    id={field}
                    value={
                      editableField === field ? fieldValue : user?.[field] || ""
                    }
                    readOnly={editableField !== field}
                    onChange={(e) => setFieldValue(e.target.value)}
                  />
                </div>
                {editableField === field ? (
                  <Button onClick={handleFieldChange} className="ml-2">
                    Change
                  </Button>
                ) : (
                  <Button onClick={() => handleFieldEdit(field as keyof User)}>
                    Edit
                  </Button>
                )}
              </div>
            )
          )}
        </div>
        <Button onClick={() => setKycModalOpen(true)} className="mt-6 w-full">
          Add KYC
        </Button>
      </div>

      {kycModalOpen && (
        <Modal onClose={() => setKycModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">KYC Form</h2>
            <div className="mb-4">
              <Label htmlFor="idType">ID Type</Label>
              <select
                id="idType"
                name="idType"
                className="w-full border-gray-300 rounded-md"
                onChange={handleKycDataChange}
                value={kycData.idType}
              >
                <option value="" disabled>
                  Select ID Type
                </option>
                <option value="voter_card">Voter Card</option>
                <option value="pan_card">PAN Card</option>
                <option value="adhar_card">Adhar Card</option>
              </select>
            </div>
            <div className="mb-4">
              <Label htmlFor="idPhoto">Upload ID Photo</Label>
              <Input
                id="idPhoto"
                name="idPhoto"
                type="file"
                onChange={handleKycDataChange}
              />
            </div>
            <Button onClick={handleKycSubmit} className="w-full">
              Submit
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ProfilePage;
