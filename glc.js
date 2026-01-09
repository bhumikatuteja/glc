<script>
        // Initialize Icons
        lucide.createIcons();

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (htmlElement.classList.contains('dark')) {
                    htmlElement.classList.remove('dark');
                    htmlElement.classList.add('light');
                } else {
                    htmlElement.classList.remove('light');
                    htmlElement.classList.add('dark');
                }
            });
        }

        // Mobile Menu
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }

        // Scroll Header Logic
        const nav = document.getElementById('main-nav');
        window.addEventListener('scroll', () => {
            if (nav) {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });

        // Modal Logic
        const modal = document.getElementById('consult-modal');
        window.openModal = function() {
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        window.closeModal = function() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        // Gmail Logic
        window.sendToGmail = function(event) {
            event.preventDefault();
            const isFooter = event.target.closest('footer');
            const prefix = isFooter ? 'footer-' : 'contact-';
            const name = document.getElementById(prefix + 'name').value;
            const email = document.getElementById(prefix + 'email').value;
            const linkedin = document.getElementById(prefix + 'linkedin').value;
            const message = isFooter ? "Interested in plans" : document.getElementById('contact-message').value;
            const subject = `GLC Consultation Request: ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0ALinkedIn: ${linkedin}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            window.location.href = `mailto:info@growlinkconnect.com?subject=${subject}&body=${body}`;
            setTimeout(closeModal, 1000);
        }

        // Interactive Process Animation
        document.addEventListener('DOMContentLoaded', () => {
            const stepTexts = document.querySelectorAll('.step-text');
            if (stepTexts.length > 0) {
                const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                if (isDesktop) {
                    stepTexts.forEach(step => {
                        step.addEventListener('mouseenter', () => {
                            stepTexts.forEach(t => t.classList.remove('active'));
                            step.classList.add('active');
                        });
                        step.addEventListener('mouseleave', () => {
                            stepTexts.forEach(t => t.classList.remove('active'));
                        });
                    });
                } else {
                    const stepObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                stepTexts.forEach(t => t.classList.remove('active'));
                                entry.target.classList.add('active');
                            }
                        });
                    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0.1 });
                    stepTexts.forEach(step => stepObserver.observe(step));
                }
            }
        });

        // --- FINAL FIXED BLOG FETCHER ---
        async function fetchWordPressPosts() {
            // This URL is specific for WordPress.com sites and is Public Access
            const SITE_DOMAIN = 'growlinkconnect.wordpress.com';
            const API_URL = `https://public-api.wordpress.com/rest/v1.1/sites/${SITE_DOMAIN}/posts/?number=3`;
            
            const container = document.getElementById('blog-container');
            if (!container) return;

            console.log("Attempting to fetch blogs from:", API_URL);

            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                
                const data = await response.json();
                console.log("Blog data received:", data);

                if (data.posts && data.posts.length > 0) {
                    container.innerHTML = ''; // Clear fallback content
                    
                    data.posts.forEach(post => {
                        // Title
                        const title = post.title;
                        // Link
                        const link = post.URL;
                        // Excerpt (Create a temporary div to strip HTML tags safely)
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = post.excerpt;
                        const plainText = tempDiv.textContent || tempDiv.innerText || "";
                        const excerpt = plainText.substring(0, 100) + '...';
                        
                        // Image (WordPress.com v1.1 usually returns featured_image as a URL string)
                        const imageUrl = post.featured_image;

                        // HTML Template
                        const imageHTML = imageUrl 
                            ? `<img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">`
                            : `<div class="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-200 dark:bg-white/10"><i data-lucide="image" class="w-8 h-8"></i></div>`;

                        const articleHTML = `
                            <article class="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1 group h-full flex flex-col">
                                <div class="h-48 bg-slate-200 dark:bg-white/10 relative overflow-hidden">
                                    ${imageHTML}
                                </div>
                                <div class="p-8 flex flex-col flex-grow">
                                    <div class="flex items-center gap-3 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <span class="text-coral">Latest</span>
                                        <span>•</span>
                                        <span class="text-slate-500">${new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display group-hover:text-linkedin transition-colors line-clamp-2">
                                        <a href="${link}" target="_blank">${title}</a>
                                    </h3>
                                    <div class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">${excerpt}</div>
                                    <a href="${link}" target="_blank" class="inline-flex items-center text-sm font-bold text-linkedin hover:text-coral transition-colors">
                                        Read Article <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i>
                                    </a>
                                </div>
                            </article>
                        `;
                        container.innerHTML += articleHTML;
                    });
                    
                    // Refresh icons
                    lucide.createIcons();
                } else {
                    console.log("No posts found in the response.");
                }
            } catch (error) {
                console.error("Blog fetch failed:", error);
            }
        }

        // --- Google Reviews Fetcher (Mock Data for Demo) ---
        async function fetchGoogleReviews() {
            const container = document.getElementById('reviews-container');
            if (!container) return;
            
            const mockReviews = [
                {
                    author_name: "Sarah Jenkins",
                    profile_photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
                    rating: 5,
                    relative_time_description: "2 weeks ago",
                    text: "Grow Link Connect transformed my LinkedIn presence. I went from zero leads to booking 3 calls a week. Highly authentic strategies that actually work."
                },
                {
                    author_name: "David Chen",
                    profile_photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
                    rating: 5,
                    relative_time_description: "a month ago",
                    text: "Professional, consistent, and strategic. They understood my niche perfectly and helped me position myself as a thought leader."
                },
                {
                    author_name: "Elena Rodriguez",
                    profile_photo_url: "https://randomuser.me/api/portraits/women/68.jpg",
                    rating: 5,
                    relative_time_description: "3 months ago",
                    text: "The best investment for my personal brand. Their protocol is rigorous but the results speak for themselves. Truly expert service."
                }
            ];

            // Render Reviews
            container.innerHTML = '';
            mockReviews.forEach(review => {
                let starsHtml = '';
                for (let i = 0; i < 5; i++) {
                    if (i < review.rating) {
                        starsHtml += `<i data-lucide="star" class="w-4 h-4 fill-current text-[#FBBC05]"></i>`;
                    } else {
                        starsHtml += `<i data-lucide="star" class="w-4 h-4 text-slate-300"></i>`;
                    }
                }

                const reviewHTML = `
                    <div class="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col h-full hover:shadow-lg transition-shadow">
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex gap-1">
                                ${starsHtml}
                            </div>
                            <div class="w-6 h-6">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            </div>
                        </div>
                        <p class="text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6 text-sm flex-grow line-clamp-4">"${review.text}"</p>
                        <div class="flex items-center gap-3 mt-auto">
                            <img src="${review.profile_photo_url}" alt="${review.author_name}" class="w-10 h-10 rounded-full object-cover bg-slate-200" onerror="this.src='https://ui-avatars.com/api/?name=${review.author_name}&background=random'">
                            <div>
                                <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">${review.author_name}</p>
                                <p class="text-[10px] text-slate-500">${review.relative_time_description}</p>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += reviewHTML;
            });
            lucide.createIcons();
        }

        // Initialize Fetchers on Load
        document.addEventListener('DOMContentLoaded', () => {
            fetchWordPressPosts();
            fetchGoogleReviews();
        });
    </script>
