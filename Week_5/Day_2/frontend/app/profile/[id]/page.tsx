"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";
import {
  useGetUserByIdQuery,
  useProfileMeQuery,
  useUpdateProfileMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../../lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { initSocket } from "../../../lib/socket";

function letterAvatar(username: string) {
  return username?.charAt(0)?.toUpperCase() || "?";
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id as string;
  const userId = useSelector((s: RootState) => s.auth.userId);
  const isOwnProfile = userId === profileId;

  const { data: profile, isFetching } = useGetUserByIdQuery(profileId);
  const { data: me } = useProfileMeQuery(undefined, { skip: !userId });

  const [updateProfile] = useUpdateProfileMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const [profileState, setProfileState] = useState<any>(null);

  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [savingPreview, setSavingPreview] = useState(false);

  const prevPreviewRef = useRef<string | null>(null);

  useEffect(() => {
    if (profile) setProfileState(profile);
  }, [profile?._id]);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    const sock = initSocket(token || "");

    sock.on("profile:update", (data: any) => {
      if (data._id === profileId) {
        setProfileState((prev: any) => ({ ...prev, ...data }));
      } else if (data._id === userId && profileId === userId) {
        setProfileState((prev: any) => ({ ...prev, ...data }));
      }
    });

    return () => {
      sock.off("profile:update");
    };
  }, [profileId, userId]);

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState<string>("");

  useEffect(() => {
    setBioDraft(profileState?.bio || "");
  }, [profileState?._id]);

  const fileRef = useRef<HTMLInputElement>(null);
  const onPickFile = () => fileRef.current?.click();

  useEffect(() => {
    const prev = prevPreviewRef.current;
    if (prev && prev !== selectedPreview) {
      try { URL.revokeObjectURL(prev); } catch {}
    }
    prevPreviewRef.current = selectedPreview;
    return () => {
      if (prevPreviewRef.current) {
        try { URL.revokeObjectURL(prevPreviewRef.current); } catch {}
        prevPreviewRef.current = null;
      }
    };
  }, [selectedPreview]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (selectedPreview) {
      try { URL.revokeObjectURL(selectedPreview); } catch {}
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedPreview(previewUrl);
    setPendingFile(file);
  };

  const onSavePreview = async () => {
    if (!pendingFile) return;
    setSavingPreview(true);
    try {
      const bitmap = await createImageBitmap(pendingFile);

      const MAX = 1024;
      let w = bitmap.width;
      let h = bitmap.height;
      if (w > h && w > MAX) {
        h = Math.round((h * MAX) / w);
        w = MAX;
      } else if (h >= w && h > MAX) {
        w = Math.round((w * MAX) / h);
        h = MAX;
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(bitmap, 0, 0, w, h);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

      await updateProfile({ profilePic: dataUrl }).unwrap();

      setPendingFile(null);
      setTimeout(() => setSelectedPreview(null), 1500);

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error("Failed compress/upload image", err);
      alert("Failed to save profile picture");
    } finally {
      setSavingPreview(false);
    }
  };

  const onDiscardPreview = () => {
    if (selectedPreview) {
      try { URL.revokeObjectURL(selectedPreview); } catch {}
    }
    setSelectedPreview(null);
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSaveBio = async () => {
    try {
      await updateProfile({ bio: bioDraft }).unwrap();
      setEditingBio(false);
    } catch {
      alert("Failed to update bio");
    }
  };

  const toggleFollow = async () => {
    if (!userId) return alert("Login first");

    const isFollowing = profileState?.isFollowing;
    setProfileState((prev: any) => ({
      ...prev,
      isFollowing: !isFollowing,
      followersCount: (prev.followersCount || 0) + (isFollowing ? -1 : 1),
    }));

    try {
      if (isFollowing) {
        await unfollowUser({ userId: profileId }).unwrap();
      } else {
        await followUser({ userId: profileId }).unwrap();
      }
    } catch {
      setProfileState((prev: any) => ({
        ...prev,
        isFollowing,
        followersCount: (prev.followersCount || 0) + (isFollowing ? 1 : -1),
      }));
      alert("Action failed");
    }
  };

  if (isFetching && !profileState) return <div className="p-6">Loading...</div>;
  if (!profileState) return <div className="p-6">User not found</div>;

  const counts = {
    followers: profileState.followersCount ?? (profileState.followers?.length || 0),
    following: profileState.followingCount ?? (profileState.following?.length || 0),
  };

  return (
    <div className="max-w-3xl mx-auto p-6 px-4 sm:px-6 relative">
      <div className="md:absolute md:top-4 md:right-4 mt-2 md:mt-0">
        <button
          onClick={() => router.push("/")}
          className="text-white px-3 py-1 rounded text-sm"
        >
          ← Go Back
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative flex-shrink-0">
          <div
            className="w-20 h-20 sm:w-24 md:w-32 rounded-full bg-indigo-500 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl overflow-hidden select-none"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
          >
            {selectedPreview ? (
              <img src={selectedPreview} alt="preview" className="w-full h-full object-cover" />
            ) : profileState.profilePic ? (
              <img
                src={profileState.profilePic}
                alt={profileState.username}
                className="w-full h-full object-cover"
              />
            ) : (
              letterAvatar(profileState.username)
            )}
          </div>

          {isOwnProfile && (
            <button
              className="absolute bottom-0 right-0 -mb-2 -mr-2 rounded-full bg-blue-900 border shadow p-2 text-xs sm:text-sm"
              onClick={onPickFile}
              title="Edit profile picture"
            >
              <FaEdit />
            </button>
          )}

          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/*" 
            ref={fileRef}
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold truncate">
              {profileState.username}
            </h1>
            {!isOwnProfile && (
              <button
                onClick={toggleFollow}
                className={`whitespace-nowrap text-sm sm:text-base px-3 sm:px-4 py-1 rounded-full border ${
                  profileState.isFollowing
                    ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                }`}
              >
                {profileState.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <div><span className="font-semibold">{counts.followers}</span> followers</div>
            <div><span className="font-semibold">{counts.following}</span> following</div>
          </div>
        </div>
      </div>

      {selectedPreview && (
        <div className="mt-4 flex flex-col sm:flex-row items-start gap-4">
          <div>
            <strong>Selected image preview:</strong>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded overflow-hidden mt-2 border">
              <img src={selectedPreview} alt="preview" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col mt-2 sm:mt-6">
            <button
              className="btn bg-green-600 text-white"
              onClick={onSavePreview}
              disabled={savingPreview}
            >
              {savingPreview ? "Saving..." : "Save"}
            </button>
            <button
              className="btn bg-gray-200 text-black"
              onClick={onDiscardPreview}
              disabled={savingPreview}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Bio</h2>
          {isOwnProfile && (
            <button
              className="text-sm flex items-center gap-2"
              onClick={() => setEditingBio((v) => !v)}
            >
              <FaEdit /> {editingBio ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {!editingBio ? (
          <p className="mt-2 whitespace-pre-wrap break-words">
            {profileState.bio ? profileState.bio : (isOwnProfile ? "Write something about yourself…" : "No bio yet.")}
          </p>
        ) : (
          <div className="mt-2">
            <textarea
              className="w-full p-3 border rounded-lg"
              rows={4}
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              placeholder="Tell the world about you…"
            />
            <div className="mt-2 flex gap-2 flex-wrap">
              <button className="btn" onClick={onSaveBio}>Save</button>
              <button
                className="btn"
                onClick={() => { setEditingBio(false); setBioDraft(profileState.bio || ""); }}
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
