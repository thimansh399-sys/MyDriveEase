import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0B0B0B),
      extendBodyBehindAppBar: true,
      body: SafeArea(
        child: Column(
          children: [
            // 🔻 CONTENT
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    // 🔝 TOP BAR
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Icon(Icons.menu, color: Colors.white, size: 28),
                        Icon(Icons.notifications, color: Colors.white, size: 28),
                      ],
                    ),

                    SizedBox(height: 20),

                    // 👋 HEADER
                    Text(
                      "Hey Himanshu 👋",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    SizedBox(height: 5),

                    Text(
                      "Book your driver instantly",
                      style: TextStyle(color: Colors.white70, fontSize: 16),
                    ),

                    SizedBox(height: 30),

                    // 🔍 FLOATING SEARCH CARD
                    Container(
                      padding: EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.search, color: Colors.greenAccent, size: 24),
                          SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              "Where do you want to go?",
                              style: TextStyle(color: Colors.white54, fontSize: 16),
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 30),

                    // 🚗 SERVICE TYPES
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _serviceCard(Icons.local_taxi, "Local"),
                        _serviceCard(Icons.flight, "Airport"),
                        _serviceCard(Icons.access_time, "Hourly"),
                        _serviceCard(Icons.map, "Outstation"),
                      ],
                    ),

                    SizedBox(height: 30),

                    // 📊 FEATURE CARDS
                    _featureCard(
                      title: "Quick Ride",
                      subtitle: "Book in 2 taps",
                      icon: Icons.flash_on,
                    ),

                    SizedBox(height: 12),

                    _featureCard(
                      title: "Saved Locations",
                      subtitle: "Home, Work & more",
                      icon: Icons.bookmark,
                    ),

                    SizedBox(height: 12),

                    _featureCard(
                      title: "My Bookings",
                      subtitle: "Track past rides",
                      icon: Icons.history,
                    ),
                    
                    SizedBox(height: 80),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      // 🔻 MODERN BOTTOM NAV
      bottomNavigationBar: Container(
        margin: EdgeInsets.all(16),
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: Color(0xFF1E1E1E),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _navItem(Icons.home, "Home", 0),
            _navItem(Icons.book, "Bookings", 1),
            _navItem(Icons.people, "Drivers", 2),
            _navItem(Icons.person, "Profile", 3),
          ],
        ),
      ),
    );
  }

  // 🔹 Service Card
  Widget _serviceCard(IconData icon, String text) {
    return Column(
      children: [
        Container(
          padding: EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white10,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.greenAccent, size: 24),
        ),
        SizedBox(height: 8),
        Text(text, style: TextStyle(color: Colors.white70, fontSize: 12)),
      ],
    );
  }

  // 🔹 Feature Card
  Widget _featureCard({
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white10,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.greenAccent, size: 24),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                SizedBox(height: 2),
                Text(subtitle, style: TextStyle(color: Colors.white54, fontSize: 13)),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, color: Colors.white38, size: 18),
        ],
      ),
    );
  }

  // 🔹 Bottom Nav Item
  Widget _navItem(IconData icon, String label, int index) {
    final isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: isActive ? Colors.greenAccent : Colors.white54, size: 26),
            SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isActive ? Colors.greenAccent : Colors.white54,
                fontSize: 11,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
