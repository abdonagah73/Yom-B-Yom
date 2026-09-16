/**
 * =========================================================
 * YOM-B-YOM SOCIAL & PROFILE API SERVICE (SocialAPI)
 * - Dynamic Profile Management (Public / Private)
 * - Customizable Showcase (Hobbies, Tasks, Projects, Habits)
 * - Community Feed & LocalStorage Persistence
 * =========================================================
 */

const SocialAPI = (function () {
    const STORAGE_KEY = "yombyom_community_profiles_v1";
    const CURRENT_USER_KEY = "yombyom_current_user_profile_v1";

    // Initial Seed Profiles
    const DEFAULT_PROFILES = [
        {
            id: "user_sarah",
            username: "sarah_c",
            name: "Sarah Connor",
            avatar: "../images/will-smith.jpg",
            avatarText: "S",
            bio: "Passionate about mindfulness, UX design, and morning runs. Building daily consistency!",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["Photography 📷", "Trail Running 🏃‍♀️", "Specialty Coffee ☕"],
                showTasks: true,
                tasks: ["Redesign User Profile Flow", "Weekly Meal Prep", "Review Dashboard Analytics"],
                showProjects: true,
                projects: ["Mindful Living Blog", "Plant Care Tracker"],
                showHabits: true,
                habits: ["Morning Meditation (18d streak)", "Read 25 Pages Daily", "No Screen After 10PM"]
            }
        },
        {
            id: "user_laila",
            username: "laila_art",
            name: "Laila Hassan",
            avatar: "",
            avatarText: "L",
            bio: "Architect & Digital Painter. Organizing my creative workflow and financial goals on Yom-B-Yom.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["Digital Painting 🎨", "Baking Pastries 🥐", "Chess ♟️"],
                showTasks: false,
                tasks: [],
                showProjects: true,
                projects: ["Eco-Friendly Living Concept", "3D Villa Mockup"],
                showHabits: true,
                habits: ["Daily Sketching (42d streak)", "10,000 Steps Daily", "Hydrate 3L"]
            }
        },
        {
            id: "user_omar",
            username: "omar_tech",
            name: "Omar Farouk",
            avatar: "",
            avatarText: "O",
            bio: "Full-stack developer & productivity hacker. Sharing my code sprints and fitness journey.",
            isPublic: true,
            isOnline: false,
            showcase: {
                showHobbies: true,
                hobbies: ["Cycling 🚴‍♂️", "Board Games 🎲", "Podcasts 🎙️"],
                showTasks: true,
                tasks: ["Ship Yom-B-Yom Dark Mode", "Fix API Latency", "Database Backup"],
                showProjects: true,
                projects: ["Smart IoT Dashboard", "Habit Gamifier Extension"],
                showHabits: false,
                habits: []
            }
        },
        {
            id: "user_mark",
            username: "mark_z",
            name: "Mark Zuckerberg",
            avatar: "../images/mark-zuckerberg.jpg",
            avatarText: "M",
            bio: "Tech entrepreneur exploring AI, VR interfaces, and endurance fitness routines.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["Jiu-Jitsu 🥋", "Hydrofoiling 🏄‍♂️", "Coding 💻"],
                showTasks: true,
                tasks: ["Open Source AI Models", "Metaverse Architecture Review"],
                showProjects: true,
                projects: ["Next-Gen VR Headset", "Clean Energy Datacenter"],
                showHabits: true,
                habits: ["Intense Daily Workout", "Read 1 Book / 2 Weeks"]
            }
        },
        {
            id: "user_larry",
            username: "larry_p",
            name: "Larry Page",
            avatar: "../images/larry-page.jpg",
            avatarText: "L",
            bio: "Co-founder of Google. Passionate about clean mobility, computing foundations, and deep focus.",
            isPublic: true,
            isOnline: false,
            showcase: {
                showHobbies: true,
                hobbies: ["Kiteboarding 🪁", "Quantum Computing Research 🔬", "Reading 📚"],
                showTasks: false,
                tasks: [],
                showProjects: true,
                projects: ["Autonomous Aviation", "Global Clean Energy Grid"],
                showHabits: true,
                habits: ["Deep Work Morning Block", "Daily 5km Walk"]
            }
        },
        {
            id: "user_alan",
            username: "alan_t",
            name: "Alan Turing",
            avatar: "../images/Alan turing.jpeg",
            avatarText: "A",
            bio: "Mathematician, cryptanalyst and computer pioneer. Solving complex logical puzzles.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["Long Distance Marathon 🏃‍♂️", "Chess Puzzles ♟️", "Botanical Studies 🌿"],
                showTasks: true,
                tasks: ["Morphogenesis Paper", "Turing Test Formulations"],
                showProjects: true,
                projects: ["Automatic Computing Engine", "Cryptanalysis Logic"],
                showHabits: true,
                habits: ["Daily Mathematical Theorem Review", "Outdoor Running"]
            }
        },
        {
            id: "user_bill",
            username: "bill_g",
            name: "Bill Gates",
            avatar: "../images/Bill gate.jpeg",
            avatarText: "B",
            bio: "Software pioneer & global health philanthropist. Dedicated to learning and sustainable innovation.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["Bridge & Cards 🃏", "Tennis 🎾", "Reading Non-fiction 📖"],
                showTasks: true,
                tasks: ["Annual Letter Review", "Clean Nuclear Tech Briefing"],
                showProjects: true,
                projects: ["Global Malaria Eradication", "Breakthrough Energy Ventures"],
                showHabits: true,
                habits: ["Think Week Reading Retreat", "Daily Note Taking"]
            }
        },
        {
            id: "user_tom",
            username: "tom_c",
            name: "Tom Cruise",
            avatar: "../images/tom-cruise.jpg",
            avatarText: "T",
            bio: "Actor and producer. Pushing boundaries through discipline, aerial stunts, and filmmaking.",
            isPublic: true,
            isOnline: false,
            showcase: {
                showHobbies: true,
                hobbies: ["Aviation & Flying ✈️", "Skydiving 🪂", "Motorcycle Riding 🏍️"],
                showTasks: true,
                tasks: ["Stunt Choreography Review", "Pre-production Script Reading"],
                showProjects: true,
                projects: ["Mission Impossible Next Chapter", "Space Action Movie"],
                showHabits: true,
                habits: ["5:30 AM Workout Routine", "Zero-Sugar Nutrition Plan"]
            }
        }
    ];

    // Helper: Initialize Profiles Storage
    function getStoredProfiles() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error("Error reading community profiles:", e);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
        return DEFAULT_PROFILES;
    }

    // Helper: Save Profiles Storage
    function saveStoredProfiles(profiles) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }

    // Helper: Get Current User Profile Data
    function getCurrentUserProfile() {
        const username = localStorage.getItem("userName") || "Friend";
        const email = (JSON.parse(localStorage.getItem("user")) || {}).email || "user@yombyom.com";

        let userProfile = null;
        try {
            const saved = localStorage.getItem(CURRENT_USER_KEY);
            if (saved) {
                userProfile = JSON.parse(saved);
            }
        } catch (e) {
            console.error("Error reading current user profile:", e);
        }

        if (!userProfile) {
            userProfile = {
                id: "current_user_me",
                username: username,
                name: username,
                email: email,
                avatar: "",
                avatarText: username.charAt(0).toUpperCase() || "U",
                bio: "Making every day count with focus, healthy habits, and meaningful progress.",
                isPublic: true, // Default to Public as requested
                isOnline: true,
                isCurrentUser: true,
                showcase: {
                    showHobbies: true,
                    hobbies: ["Reading 📚", "Design & Tech 💻", "Healthy Cooking 🥗"],
                    showTasks: true,
                    tasks: ["Organize Weekly Dashboard", "Review Monthly Budget", "Complete 30m Workout"],
                    showProjects: true,
                    projects: ["Yom-B-Yom Life Setup", "Personal Finance Goal"],
                    showHabits: true,
                    habits: ["Morning Routine (14d streak)", "Daily Mood Tracking", "Evening Reflection"]
                }
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
        } else {
            // Keep synced with current localStorage userName
            userProfile.name = username;
            userProfile.username = username;
            userProfile.avatarText = username.charAt(0).toUpperCase() || "U";
        }

        return userProfile;
    }

    function saveCurrentUserProfile(profile) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
    }

    // ================= PUBLIC API METHODS =================

    return {
        /**
         * Fetch all public profiles for the Social page feed
         * @returns {Promise<Array>} List of public profiles
         */
        getPublicProfiles: function () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const community = getStoredProfiles();
                    const me = getCurrentUserProfile();

                    let combined = [];
                    // If current user is PUBLIC, show them on the Social page feed!
                    if (me.isPublic) {
                        combined.push(me);
                    }

                    // Append community public profiles
                    community.forEach(p => {
                        if (p.isPublic && p.id !== me.id && p.username !== me.username) {
                            combined.push(p);
                        }
                    });

                    resolve(combined);
                }, 100);
            });
        },

        /**
         * Get the logged-in user's full profile
         * @returns {Promise<Object>}
         */
        getMyProfile: function () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(getCurrentUserProfile());
                }, 50);
            });
        },

        /**
         * Update the logged-in user's profile settings (Privacy, Bio, Hobbies, Tasks, Projects, Habits)
         * @param {Object} updatedData 
         * @returns {Promise<Object>}
         */
        updateMyProfile: function (updatedData) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const current = getCurrentUserProfile();
                    const merged = {
                        ...current,
                        ...updatedData,
                        showcase: {
                            ...current.showcase,
                            ...(updatedData.showcase || {})
                        }
                    };

                    if (updatedData.name) {
                        localStorage.setItem("userName", updatedData.name);
                        const userObj = JSON.parse(localStorage.getItem("user")) || {};
                        userObj.username = updatedData.name;
                        if (updatedData.email) userObj.email = updatedData.email;
                        localStorage.setItem("user", JSON.stringify(userObj));
                    }

                    saveCurrentUserProfile(merged);

                    // Sync in community list if present
                    const community = getStoredProfiles();
                    const idx = community.findIndex(p => p.id === merged.id || p.username === merged.username);
                    if (idx !== -1) {
                        community[idx] = merged;
                        saveStoredProfiles(community);
                    }

                    resolve({ success: true, profile: merged });
                }, 120);
            });
        },

        /**
         * Quick Toggle Privacy: Public or Private
         * @param {boolean} isPublic 
         * @returns {Promise<boolean>}
         */
        setPrivacy: function (isPublic) {
            return this.updateMyProfile({ isPublic: Boolean(isPublic) });
        }
    };
})();

// Attach to window object for global usage across pages
window.SocialAPI = SocialAPI;
