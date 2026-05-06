import 'package:flutter/material.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  bool isPasswordVisible = false;
  bool isConfirmPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0B0B0B),
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 400),
          child: SingleChildScrollView(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                SizedBox(height: 20),

                // Back button
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: Icon(Icons.arrow_back, color: Colors.white),
                ),

                SizedBox(height: 20),

                // Title
                Center(
                  child: Column(
                    children: [
                      Text(
                        "Create Account",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        "Join DriveEase today",
                        style: TextStyle(
                          color: Colors.white54,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),

                SizedBox(height: 30),

                // Name Field
                buildTextField(
                  hint: "Full Name",
                  label: "Name",
                  icon: Icons.person,
                ),

                SizedBox(height: 20),

                // Email Field
                buildTextField(
                  hint: "example@gmail.com",
                  label: "Email",
                  icon: Icons.email,
                ),

                SizedBox(height: 20),

                // Phone Field
                buildTextField(
                  hint: "+91 9876543210",
                  label: "Phone",
                  icon: Icons.phone,
                ),

                SizedBox(height: 20),

                // Password Field
                buildTextField(
                  hint: "********",
                  label: "Password",
                  icon: Icons.lock,
                  isPassword: true,
                ),

                SizedBox(height: 20),

                // Confirm Password Field
                buildTextField(
                  hint: "********",
                  label: "Confirm Password",
                  icon: Icons.lock,
                  isPassword: true,
                  isConfirm: true,
                ),

                SizedBox(height: 30),

                // Signup Button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      "Sign Up",
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                SizedBox(height: 30),

                // Divider
                Row(
                  children: [
                    Expanded(child: Divider(color: Colors.white24)),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 10),
                      child: Text(
                        "or continue with",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                    Expanded(child: Divider(color: Colors.white24)),
                  ],
                ),

                SizedBox(height: 20),

                // Social Buttons
                Row(
                  children: [
                    Expanded(child: socialButton("Google", Icons.g_mobiledata)),
                    SizedBox(width: 15),
                    Expanded(child: socialButton("Phone", Icons.phone)),
                  ],
                ),

                SizedBox(height: 30),

// Login
                Center(
                  child: GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                    },
                    child: RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: "Already have an account? ",
                            style: TextStyle(color: Colors.white54),
                          ),
                          TextSpan(
                            text: "Login",
                            style: TextStyle(
                              color: Colors.greenAccent,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Reusable TextField
  Widget buildTextField({
    required String hint,
    required String label,
    required IconData icon,
    bool isPassword = false,
    bool isConfirm = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white70),
        ),
        SizedBox(height: 8),
        TextField(
          obscureText: isPassword 
            ? (isConfirm ? !isConfirmPasswordVisible : !isPasswordVisible)
            : false,
          style: TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.white38),
            prefixIcon: Icon(icon, color: Colors.greenAccent),
            suffixIcon: isPassword
                ? IconButton(
                    icon: Icon(
                      isConfirm
                          ? (isConfirmPasswordVisible
                              ? Icons.visibility
                              : Icons.visibility_off)
                          : (isPasswordVisible
                              ? Icons.visibility
                              : Icons.visibility_off),
                      color: Colors.white54,
                    ),
                    onPressed: () {
                      setState(() {
                        if (isConfirm) {
                          isConfirmPasswordVisible = !isConfirmPasswordVisible;
                        } else {
                          isPasswordVisible = !isPasswordVisible;
                        }
                      });
                    },
                  )
                : null,
            filled: true,
            fillColor: Colors.white10,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ],
    );
  }

  // Social Button
  Widget socialButton(String text, IconData icon) {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.white24),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.greenAccent),
            SizedBox(width: 8),
            Text(text, style: TextStyle(color: Colors.white)),
          ],
        ),
      ),
    );
  }
}
