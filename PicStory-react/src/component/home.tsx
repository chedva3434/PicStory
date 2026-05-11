"use client"
import type React from "react"
import { Box, Typography, Grid, Container, Button, Card, Avatar, Rating, Chip } from "@mui/material"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";


const HomePage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const navigate = useNavigate();


  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const features = [
    {
      icon: "📤",
      title: "Easy Upload",
      description: "Drag and drop your photos instantly",
    },
    {
      icon: "🔗",
      title: "Smart Sharing",
      description: "Share albums with friends and family",
    },
    {
      icon: "🤖",
      title: "AI Organization",
      description: "Automatically organize by faces and events",
    },
  ]

  const albums = [
    {
      title: "Family Moments",
      image: "/placeholder.svg?height=300&width=400",
      count: "124 photos",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Travel Adventures",
      image: "/placeholder.svg?height=300&width=400",
      count: "89 photos",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Special Events",
      image: "/placeholder.svg?height=300&width=400",
      count: "67 photos",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Nature & Landscapes",
      image: "/placeholder.svg?height=300&width=400",
      count: "156 photos",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "Food & Dining",
      image: "/placeholder.svg?height=300&width=400",
      count: "43 photos",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "Pets & Animals",
      image: "/placeholder.svg?height=300&width=400",
      count: "78 photos",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Photography Enthusiast",
      content: "This platform transformed how I organize and share my memories. The AI features are incredible!",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Travel Blogger",
      content: "Perfect for managing thousands of travel photos. The sharing features make collaboration seamless.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "Family Photographer",
      content: "Finally, a photo platform that understands families. Love the automatic face grouping!",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
  ]

  const stats = [
    { number: "1M+", label: "Photos Stored" },
    { number: "50K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ pt: 15, pb: 10, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label="📸 Your Photo Journey Starts Here"
              sx={{
                mb: 4,
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "16px",
                py: 2,
              }}
            />

            <Typography
              variant="h1"
              component="div" 
              sx={{
                fontSize: { xs: "3rem", md: "5rem", lg: "6rem" },
                fontWeight: "bold",
                color: "#fff",
                mb: 3,
                textShadow: "2px 2px 20px rgba(0,0,0,0.3)",
                lineHeight: 1.1,
              }}
            >
              Welcome to Your
              <Box
                component="span"
                sx={{
                  display: "block",
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Photo World
              </Box>
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 6,
                maxWidth: "800px",
                mx: "auto",
                fontWeight: 300,
                lineHeight: 1.4,
              }}
            >
              Organize, share, and create amazing memories in one place. Experience the future of photo management with
              AI-powered features ✨
            </Typography>

            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  color: "white",
                  px: 4,
                  py: 2,
                  borderRadius: "50px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Your Journey →
              </Button>

            </Box>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 10 }}>
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              component="div" 
              sx={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="h5"
              component="div" 
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                mb: 8,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Everything you need to manage, organize, and share your precious memories
            </Typography>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "20px",
                        p: 3,
                        textAlign: "center",
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          background: "rgba(255,255,255,0.15)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "4rem",
                          mb: 3,
                          display: "inline-block",
                          p: 2,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.1)",
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}>
                        {feature.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Albums Gallery */}
        <Box sx={{ py: 10 }}>
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              component="div" 
              sx={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Explore Your Albums
            </Typography>
            <Typography
              variant="h5"
              component="div" 
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                mb: 8,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Beautifully organized collections of your most treasured moments
            </Typography>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Grid container spacing={3}>
              {albums.map((album, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        position: "relative",
                        height: "300px",
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: album.gradient,
                          opacity: 0.9,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${album.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          opacity: 0.3,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 3,
                          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                        }}
                      >
                        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
                          {album.title}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>{album.count}</Typography>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: 10 }}>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "20px",
                        p: 4,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h2" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Testimonials */}
        <Box sx={{ py: 10 }}>
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              component="div" 
              sx={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="h5"
              component="div" 
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                mb: 8,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Join thousands of satisfied users who trust us with their memories
            </Typography>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      sx={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "20px",
                        p: 4,
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255,255,255,0.15)",
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.9)",
                          mb: 3,
                          fontStyle: "italic",
                          fontSize: "18px",
                          lineHeight: 1.6,
                        }}
                      >
                        "{testimonial.content}"
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={testimonial.avatar} sx={{ width: 50, height: 50, mr: 2 }} />
                        <Box>
                          <Typography sx={{ color: "white", fontWeight: "bold" }}>{testimonial.name}</Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 15, textAlign: "center" }}>
          <motion.div {...fadeInUp}>
            <Typography
              variant="h1"
              component="div" 
              sx={{
                fontSize: { xs: "3rem", md: "4rem", lg: "5rem" },
                fontWeight: "bold",
                color: "#fff",
                mb: 3,
                textShadow: "2px 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              Ready to Start? 🚀
            </Typography>
            <Typography
              variant="h5"
              component="div" 
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 6,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.4,
              }}
            >
              Join millions of users who trust us with their most precious memories. Start your photo journey today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                color: "white",
                px: 6,
                py: 3,
                borderRadius: "50px",
                fontSize: "20px",
                fontWeight: "bold",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started Free 👥
            </Button>
          </motion.div>
        </Box>
      </Container>

    </Box>
  )
}

export default HomePage
