var like_btns = document.querySelectorAll(".like")
var like_count_p = document.querySelectorAll(".like-count")

var comment_like_btns = document.querySelectorAll(".comment-like")
var comment_like_count_p = document.querySelectorAll(".comment-like-count")

var user_follow_btn = document.querySelector(".follow-btn")
var follower_count_p = document.querySelector(".follower-count")

// Like-dislike posts
for (let i = 0; i < like_btns.length; i++) {
    like_btns[i].addEventListener("click", async () => {
        try {
            like_btns[i].classList.toggle("liked")
            if (like_btns[i].classList.contains("liked")) {
                const res = await fetch(`/like/${like_btns[i].id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ increment: true })
                })
                let { newLikes } = await res.json()
                like_count_p[i].innerHTML = `<i class="fa-solid fa-heart"> </i>${newLikes}`
                like_btns[i].innerHTML = `<i class="fa-solid fa-heart"> </i> Liked`
            } else {
                const res = await fetch(`/like/${like_btns[i].id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ increment: false })
                })
                let { newLikes } = await res.json()
                like_count_p[i].innerHTML = `<i class="fa-solid fa-heart"> </i>${newLikes}`
                like_btns[i].innerHTML = `<i class="fa-regular fa-heart"> </i> Like`
            }
        } catch (err) {
            if (err.name === 'SyntaxError')
                window.location.href = '/login'
        }
    })
}

// Like-dislike comments
for (let i = 0; i < comment_like_btns.length; i++) {
    comment_like_btns[i].addEventListener("click", async () => {
        try {
            comment_like_btns[i].classList.toggle("liked")
            if (comment_like_btns[i].classList.contains("liked")) {
                const res = await fetch(`/like/comment/${comment_like_btns[i].id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ increment: true })
                })
                let { newLikes } = await res.json()
                comment_like_count_p[i].innerHTML = `${newLikes}`
                comment_like_btns[i].innerHTML = `<i class="fa-solid fa-heart"></i> </i>`
            } else {
                const res = await fetch(`/like/comment/${comment_like_btns[i].id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ increment: false })
                })
                let { newLikes } = await res.json()
                comment_like_count_p[i].innerHTML = `${newLikes}`
                comment_like_btns[i].innerHTML = `<i class="fa-regular fa-heart"></i> </i>`
            }
        } catch (err) {
            if (err.name === 'SyntaxError')
                window.location.href = '/login'
        }
    })
}

// Follow-unfollow users

user_follow_btn.addEventListener("click", async () => {
    try {
        user_follow_btn.classList.toggle("followed")
        if (user_follow_btn.classList.contains("followed")) {
            const res = await fetch(`/user/follow/${user_follow_btn.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ increment: true })
            })
            let { newFollowers } = await res.json()
            follower_count_p.innerHTML = `<i class="fa-solid fa-user-group"></i>Followed by ${newFollowers} people`
            user_follow_btn.innerHTML = `<i class="fa-solid fa-check"></i>Following`
        } else {
            const res = await fetch(`/user/follow/${user_follow_btn.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ increment: false })
            })
            let { newFollowers } = await res.json()
            follower_count_p.innerHTML = `<i class="fa-solid fa-user-group"></i>Followed by ${newFollowers} people`
            user_follow_btn.innerHTML = `<i class="fa-solid fa-user-plus"></i>Follow`
        }
    } catch (err) {
        if (err.name === 'SyntaxError')
            window.location.href = '/login'
    }
})

