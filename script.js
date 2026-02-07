document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mouse Move Dynamic Gradient (The "Live" Effect)
    document.addEventListener('mousemove', function(e){
        const x = e.clientX;
        const y = e.clientY;
        
        // This subtly moves a gradient behind the cursor
        // Using fixed background to prevent jitter
        document.body.style.background = `
            radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 242, 255, 0.05), transparent 40%),
            radial-gradient(circle at 10% 20%, rgba(188, 19, 254, 0.1), transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(0, 242, 255, 0.1), transparent 40%),
            #050505
        `;
        document.body.style.backgroundAttachment = "fixed";
    });

    // 2. Scroll Reveal Animation
    window.addEventListener('scroll', reveal);
    
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var revealTop = reveals[i].getBoundingClientRect().top;
            var revealPoint = 100;
            
            if (revealTop < windowHeight - revealPoint) {
                reveals[i].classList.add('active');
            }
        }
    }
    
    // Trigger once on load to show elements already in view
    reveal();
});

// 1. Initialize Supabase ONCE globally
// We attach it to 'window' so other scripts (like your contact form) can use it.
window._supabase = supabase.createClient('https://mudrfauiwmxbeiedlizv.supabase.co', 'sb_publishable_AhQfALJCjBNrXpR5WEkeSg_6i5ek5Bq');

// 2. Function to update views
async function trackView() {
    // Dynamically get the page name (e.g., 'home.html' or 'contact.html')
    const path = window.location.pathname.split("/").pop() || 'index.html';
    const pageKey = path.replace('.html', ''); 

    const { error } = await window._supabase.rpc('increment_views', { 
        target_page_name: pageKey 
    });

    if (error) {
        console.error('View tracking failed:', error.message);
    } else {
        console.log(`View recorded for: ${pageKey}`);
        displayViews(pageKey); 
    }
}

// 3. Function to show the count
async function displayViews(pageKey) {
    const { data, error } = await window._supabase
        .from('analytics')
        .select('views')
        .eq('page_name', pageKey)
        .single();

    if (error) {
        console.warn('Could not fetch view count:', error.message);
        return;
    }

    const viewElement = document.getElementById('view-count');
    if (data && viewElement) {
        viewElement.innerText = `${data.views} views`;
    }
}

// Run tracking when the script loads
trackView();


async function loadProjects() {
    // 1. Fetch from your projects table
    const { data, error } = await window._supabase
        .from('projects')
        .select('*')
        .order('priority', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        return;
    }

    // 2. Find the container in your HTML
    const container = document.getElementById('projects-container');
    if (!container) return;

    // 3. Map the data to your HTML structure
    container.innerHTML = data.map(project => `
        <div class="col-lg-4 col-md-6 mb-4 reveal">
            <div class="glass-card h-100">
                <div class="position-relative mb-4">
                    <img class="img-fluid rounded w-100" src="${project.image_url}" alt="${project.name}">
                    <div class="project-overlay">
                        <a class="btn btn-outline-primary" href="${project.live_url}" target="_blank">
                            <i class="fa fa-link"></i>
                        </a>
                    </div>
                </div>
                <h5>${project.name}</h5>
                <p class="small text-muted">${project.year}</p>
                <p>${project.description}</p>
                <div class="d-flex flex-wrap mb-3">
                    ${project.tech_stack ? project.tech_stack.split(',').map(tech => 
                        `<span class="badge badge-primary m-1">${tech.trim()}</span>`
                    ).join('') : ''}
                </div>
                <a href="${project.github_url}" class="text-primary" target="_blank">
                    <i class="fab fa-github mr-2"></i>Source Code
                </a>
            </div>
        </div>
    `).join('');
}

// Call it when the page loads
document.addEventListener('DOMContentLoaded', loadProjects);