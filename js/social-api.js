/**
 * =========================================================
 * YOM-B-YOM SOCIAL & PROFILE API SERVICE (SocialAPI)
 * - Dynamic Profile Management (Public / Private)
 * - Customizable Showcase (Hobbies, Tasks, Projects, Habits)
 * - Community Feed & LocalStorage Persistence
 * =========================================================
 */

const SocialAPI = (function () {
    const STORAGE_KEY = "yombyom_community_profiles_v2";
    const CURRENT_USER_KEY = "yombyom_current_user_profile_v1";

    // Initial Seed Profiles
    const DEFAULT_PROFILES = [
        {
            id: "user_big_ramy",
            username: "big_ramy",
            name: "بيج رامي (Big Ramy)",
            avatar: "../images/big-ramy.jpg",
            avatarText: "ر",
            bio: "ممدوح السبيعي - بطل مستر أولمبيا مرتين 🏆🏆. فخر مصر والعرب في كمال الأجسام والتحفيز الرياضي.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["رفع الأثقال والحديد الثقيل 🏋️‍♂️", "صيد السمك 🎣", "تحفيز الرياضيين 🥇"],
                showTasks: true,
                tasks: ["تمرين أرجل سوبر سيت 300 كجم", "وجبة صدور دجاج وأرز رقم 4", "جلسة استشفاء عضلي"],
                showProjects: true,
                projects: ["أكاديمية Ramy للأبطال", "بطولة كمال أجسام للهواة"],
                showHabits: true,
                habits: ["تمرين مرتين يومياً (صباحي ومسائي)", "تناول 6 وجبات محسوبة السعرات", "نوم 8 ساعات بانتظام"]
            }
        },
        {
            id: "user_tamer_gayar",
            username: "tamer_elgayar",
            name: "تامر الجيار (Tamer El Gayar)",
            avatar: "../images/tamer-elgayar.png",
            avatarText: "ت",
            bio: "نجم وصانع محتوى تيك توك الشهير ✨👟. ملك الكاريزما والأناقة والروقان والسكتشات اليومية.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["تصوير فيديوهات تيك توك 📱", "عالم الموضة والأزياء 🎽", "الجيم واللياقة البدنية 💪"],
                showTasks: true,
                tasks: ["تصوير تريند تيك توك جديد", "لايف الساعة 9 مع المتابعين", "تنسيق أوتفيت الأسبوع"],
                showProjects: true,
                projects: ["براند ملابس وكاجوال الجيار", "بودكاست الجيار شو"],
                showHabits: true,
                habits: ["تصوير 3 تيك توك يومياً", "تمرين حديد مسائي", "شرب 3 لتر مياه"]
            }
        },
        {
            id: "user_elshazly",
            username: "elshazly_tiktok",
            name: "الشاذلي (El Shazly)",
            avatar: "../images/el-shazly.jpg",
            avatarText: "ش",
            bio: "صاحبي اللي خاني وباعني عشان بصلة 🧅! نجم التيك توك وصاحب أشهر إفيهات وتريندات كوميدية.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["تقشير وتقطيع البصل 🧅", "تسجيل إفيهات وسكتشات 🎬", "متابعة تريندات السوشيال 📈"],
                showTasks: true,
                tasks: ["تصوير كليب البصلة الجديد", "مقابلة صاحبي اللي خاني", "شراء شوال بصل أحمر جديد"],
                showProjects: true,
                projects: ["سلسلة سكتشات خيانة الصحاب", "برنامج الشاذلي في السوق"],
                showHabits: true,
                habits: ["تقطيع 5 كيلو بصل بدون دموع", "تسجيل سكتش يومي", "كوباية شاي كشري في الخمسينة"]
            }
        },
        {
            id: "user_beso_blaban",
            username: "beso_blaban",
            name: "بيسو بتاع بلبن (Beso B.Laban)",
            avatar: "../images/beso-blaban.png",
            avatarText: "ب",
            bio: "قلبظ يا عم قلبظ 🍨🥛! نجم حلويات B.Laban وصانع البهجة، القشطوطة، الكشري الحلو والمسحب المسكر.",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["ابتكار حلويات وقشطة ومكسرات 🍧", "تذوق اللوتس والفسدق 🥜", "صناعة البهجة والفرحة 🌟"],
                showTasks: true,
                tasks: ["تحضير 50 صينية قشطوطة مانجا", "تصوير فيديو قلبظ يا عم قلبظ", "تجهيز صوص بستاشيو إضافي"],
                showProjects: true,
                projects: ["افتتاح فرع بلبن الجديد", "ابتكار طبق حلو الصيف 2026"],
                showHabits: true,
                habits: ["تذوق الحلاوة يومياً", "رش مكسرات بسخاء", "ابتسامة وطاقة إيجابية دائمة"]
            }
        },
        {
            id: "user_will",
            username: "will_smith",
            name: "Will Smith",
            avatar: "../images/will-smith.jpg",
            avatarText: "W",
            bio: "Actor, producer & musician. Focused on discipline, physical fitness, and daily consistency!",
            isPublic: true,
            isOnline: true,
            showcase: {
                showHobbies: true,
                hobbies: ["Running 🏃‍♂️", "Filmmaking 🎬", "Chess ♟️"],
                showTasks: true,
                tasks: ["Morning Fitness Routine", "Read 30 Min Daily", "Script Analysis & Prep"],
                showProjects: true,
                projects: ["Creative Storytelling Workshop", "Clean Energy Initiative"],
                showHabits: true,
                habits: ["5 AM Cardio (28d streak)", "Daily Journaling", "Hydrate 3L"]
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
                let profiles = JSON.parse(data);
                let updated = false;

                // Merge in any missing default profiles at top
                DEFAULT_PROFILES.forEach(dp => {
                    const exists = profiles.some(p => p.id === dp.id);
                    if (!exists) {
                        profiles.push(dp);
                        updated = true;
                    }
                });

                // Fix legacy sarah
                profiles = profiles.map(p => {
                    if (p.id === "user_sarah" || (p.avatar && p.avatar.includes("will-smith.jpg") && p.name !== "Will Smith")) {
                        updated = true;
                        return DEFAULT_PROFILES.find(x => x.id === "user_will") || p;
                    }
                    return p;
                });

                if (updated) {
                    saveStoredProfiles(profiles);
                }
                return profiles;
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
