"use client"
import { useState } from "react"
import emailjs from "@emailjs/browser"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import { Box, Typography, IconButton, Divider, Container } from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled"
import EmailIcon from "@mui/icons-material/Email"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"

const StyledFooter = styled(Box)(() => ({
  width: "100%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
  position: "relative",
  overflow: "hidden",
  marginTop: "auto",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #f093fb, #f5576c, #4facfe, #00f2fe)",
    backgroundSize: "300% 100%",
    animation: "gradient 3s ease infinite",
  },
}))

const ContactItem = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "12px 24px",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
  },
}))

const SocialButton = styled(IconButton)(() => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  width: "50px",
  height: "50px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.1) rotate(5deg)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
  },
}))

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-error fieldset": {
      borderColor: "#ff6b6b",
    },
  },
  "& .MuiInputLabel-outlined": {
    color: "#333",
    "&.Mui-focused": {
      color: "#667eea",
    },
    "&.Mui-error": {
      color: "#ff6b6b",
    },
  },
  "& .MuiInputBase-input": {
    color: "#333",
  },
  "& .MuiFormHelperText-root": {
    color: "#ff6b6b",
    fontWeight: "500",
    marginLeft: "8px",
    "&.Mui-error": {
      color: "#ff6b6b",
    },
  },
  "& .MuiInputLabel-asterisk": {
    color: "#ff6b6b",
  },
}))

const Footer1 = () => {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = "service_8ojuyok"
  const EMAILJS_TEMPLATE_ID_ADMIN = "template_xczr0w8"
  const EMAILJS_TEMPLATE_ID_USER = "template_f8jpwdb"
  const EMAILJS_PUBLIC_KEY = "mehneN--fLxBPyaOj"

  useState(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  })

  const sendEmailJS = async (templateId: string, templateParams: any) => {
    try {
      console.log(`📧 Sending email with template ${templateId}:`, templateParams)

      const response = await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams, EMAILJS_PUBLIC_KEY)

      console.log("✅ Email sent successfully:", response)
      return response
    } catch (error) {
      console.error("❌ EmailJS Error:", error)
      throw error
    }
  }

  const handleEmailSubmit = async () => {
    setEmailError(false)
    setErrorMessage("")

    const errors = []
    if (!emailForm.name.trim()) errors.push("Name")
    if (!emailForm.email.trim()) errors.push("Email")
    if (!emailForm.subject.trim()) errors.push("Subject")
    if (!emailForm.message.trim()) errors.push("Message")

    if (errors.length > 0) {
      setErrorMessage(`Please fill in the following required fields: ${errors.join(", ")}`)
      setEmailError(true)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailForm.email)) {
      setErrorMessage("Please enter a valid email address")
      setEmailError(true)
      return
    }

    setEmailSending(true)

    try {
      const adminTemplateParams = {
        from_name: emailForm.name,
        from_email: emailForm.email,
        subject: emailForm.subject,
        message: emailForm.message,
        to_email: "ch0534194892@gmail.com",
        reply_to: emailForm.email,
        timestamp: new Date().toLocaleString("he-IL"),
      }

      const userTemplateParams = {
        to_name: emailForm.name,
        to_email: emailForm.email,
        from_name: "PicStory Team",
        subject: `Thank you for contacting PicStory - ${emailForm.subject}`,
        original_message: emailForm.message,
        original_subject: emailForm.subject,
        admin_email: "ch0534194892@gmail.com",
      }

      await sendEmailJS(EMAILJS_TEMPLATE_ID_ADMIN, adminTemplateParams)
      await sendEmailJS(EMAILJS_TEMPLATE_ID_USER, userTemplateParams)

      console.log("✅ Both emails sent successfully!")

      setEmailSending(false)
      setEmailSent(true)

      setTimeout(() => {
        setEmailModalOpen(false)
        setEmailSent(false)
        setEmailForm({ name: "", email: "", subject: "", message: "" })
      }, 3000)
    } catch (error) {
      console.error("❌ Error sending emails:", error)
      setEmailSending(false)
      setEmailError(true)
      setErrorMessage("Failed to send email. Please try again or contact us directly.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEmailForm((prev) => ({ ...prev, [field]: value }))
    if (emailError) {
      setEmailError(false)
      setErrorMessage("")
    }
  }

  const socialLinks = [
    { icon: <FacebookIcon />, color: "#1877f2", label: "Facebook" },
    { icon: <TwitterIcon />, color: "#1da1f2", label: "Twitter" },
    { icon: <InstagramIcon />, color: "#e4405f", label: "Instagram" },
    { icon: <LinkedInIcon />, color: "#0077b5", label: "LinkedIn" },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <StyledFooter>
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "200px",
          height: "200px",
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
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Box sx={{ py: 6 }}>
            {/* Header Section */}
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #f093fb, #f5576c)",
                    mb: 3,
                    boxShadow: "0 10px 30px rgba(240, 147, 251, 0.3)",
                  }}
                >
                  <PhotoLibraryIcon sx={{ fontSize: "35px", color: "white" }} />
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    mb: 2,
                    textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  PicStory
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    maxWidth: "500px",
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Your memories, beautifully organized and shared with the world
                </Typography>
              </Box>
            </motion.div>

            {/* Contact Section */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                  mb: 5,
                }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ContactItem onClick={() => window.open("tel:0534194892")}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #4caf50, #45a049)",
                        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                      }}
                    >
                      <PhoneEnabledIcon sx={{ color: "white", fontSize: "22px" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Call Us
                      </Typography>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        0534194892
                      </Typography>
                    </Box>
                  </ContactItem>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ContactItem onClick={() => setEmailModalOpen(true)}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #2196f3, #1976d2)",
                        boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                      }}
                    >
                      <EmailIcon sx={{ color: "white", fontSize: "22px" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Email Us
                      </Typography>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        ch0534194892@gmail.com
                      </Typography>
                    </Box>
                  </ContactItem>
                </motion.div>
              </Box>
            </motion.div>

            {/* Social Media Section */}
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "#fff",
                    fontWeight: "600",
                    mb: 3,
                    textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  Follow Us
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {socialLinks.map((social) => (
                    <motion.div
                      key={social.label}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <SocialButton
                        sx={{
                          "&:hover": {
                            background: `${social.color}20`,
                            borderColor: social.color,
                            color: social.color,
                          },
                        }}
                      >
                        {social.icon}
                      </SocialButton>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants}>
              <Divider
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  mb: 3,
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 1,
                    fontSize: "14px",
                  }}
                >
                  © 2024 PicStory. All rights reserved.
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  Made with
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <FavoriteIcon sx={{ fontSize: "16px", color: "#e91e63" }} />
                  </motion.div>
                  for photographers worldwide
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Email Modal */}
      <Dialog
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "#333",
            fontWeight: "bold",
            fontSize: "24px",
            pb: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          📧 Send us a Message
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 3 }}>
          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: "80px",
                    color: "#4caf50",
                    mb: 2,
                    animation: "bounce 0.6s ease-in-out",
                  }}
                />
                <Typography variant="h5" component="div"
                  sx={{ color: "#4caf50", fontWeight: "bold", mb: 2 }}>
                  Message Sent Successfully! ✨
                </Typography>
                <Typography variant="body1" component="div"
                  sx={{ color: "#666", mb: 2 }}>
                  Thank you for contacting us! We've received your message and will get back to you soon.
                </Typography>
                <Typography variant="body2" component="div"
                  sx={{ color: "#999" }}>
                  You should also receive a confirmation email shortly.
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
              {emailError && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                    border: "1px solid #f44336",
                  }}
                  icon={<ErrorIcon />}
                >
                  {errorMessage}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <StyledTextField
                  label="Your Name *"
                  fullWidth
                  required
                  value={emailForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  variant="outlined"
                  error={emailForm.name !== "" && !emailForm.name.trim()}
                  helperText={emailForm.name !== "" && !emailForm.name.trim() ? "Name is required" : ""}
                />
                <StyledTextField
                  label="Your Email *"
                  type="email"
                  fullWidth
                  required
                  value={emailForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  variant="outlined"
                  error={
                    (emailForm.email !== "" && !emailForm.email.trim()) ||
                    (emailForm.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email))
                  }
                  helperText={
                    !emailForm.email.trim() && emailForm.email !== ""
                      ? "Email is required"
                      : emailForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)
                        ? "Please enter a valid email"
                        : ""
                  }
                />
              </Box>

              <StyledTextField
                label="Subject *"
                fullWidth
                required
                value={emailForm.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                variant="outlined"
                error={emailForm.subject !== "" && !emailForm.subject.trim()}
                helperText={emailForm.subject !== "" && !emailForm.subject.trim() ? "Subject is required" : ""}
              />

              <StyledTextField
                label="Your Message *"
                multiline
                rows={6}
                fullWidth
                required
                value={emailForm.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                variant="outlined"
                placeholder="Tell us what's on your mind..."
                error={emailForm.message !== "" && !emailForm.message.trim()}
                helperText={emailForm.message !== "" && !emailForm.message.trim() ? "Message is required" : ""}
              />

              <Alert
                severity="info"
                sx={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  border: "1px solid #2196f3",
                }}
              >
                💡 Your message will be sent to our team, and you'll receive a confirmation email at your address.
              </Alert>
            </Box>
          )}
        </DialogContent>

        {!emailSent && (
          <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
            <Button
              onClick={() => {
                setEmailModalOpen(false)
                setEmailError(false)
                setErrorMessage("")
              }}
              sx={{
                color: "#666",
                borderColor: "#e0e0e0",
                borderRadius: "25px",
                px: 3,
                "&:hover": {
                  borderColor: "#bdbdbd",
                  backgroundColor: "#f5f5f5",
                },
              }}
              variant="outlined"
              disabled={emailSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmailSubmit}
              disabled={emailSending}
              variant="contained"
              startIcon={emailSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                borderRadius: "25px",
                px: 4,
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                },
                "&:disabled": {
                  background: "#ccc",
                },
              }}
            >
              {emailSending ? "Sending Message..." : "Send Message"}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* CSS Animations */}
      <style>
        {
          `@keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes bounce {
            0%, 20%, 60%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            80% {
              transform: translateY(-5px);
            }
          }`
        }
      </style>
    </StyledFooter>
  )
}

export default Footer1
