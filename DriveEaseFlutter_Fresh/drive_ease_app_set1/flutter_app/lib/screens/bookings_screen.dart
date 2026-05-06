import 'package:flutter/material.dart';

class BookingsScreen extends StatelessWidget {
  final String userName;
  
  const BookingsScreen({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    final bookings = [
      {
        'from': 'Connaught Place, Delhi',
        'to': 'IGI Airport, Delhi',
        'date': 'Today, 10:30 AM',
        'price': '₹450',
        'status': 'Completed',
      },
      {
        'from': 'Cyber City, Gurgaon',
        'to': 'Mall of India',
        'date': 'Yesterday, 6:00 PM',
        'price': '₹320',
        'status': 'Completed',
      },
      {
        'from': 'Rajouri Garden',
        'to': 'Nehru Place Metro',
        'date': 'Mar 15, 2024',
        'price': '₹280',
        'status': 'Completed',
      },
    ];

    return Scaffold(
      backgroundColor: Color(0xFF0B0B0B),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 👋 Header
              Text(
                "Hi $userName 👋",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 4),
              Text(
                "Your Bookings",
                style: TextStyle(color: Colors.white70),
              ),

              SizedBox(height: 30),

              // 📊 Stats Row
              Row(
                children: [
                  _statCard("12", "Total\nRides"),
                  SizedBox(width: 12),
                  _statCard("₹2,450", "Total\nSpent"),
                  SizedBox(width: 12),
                  _statCard("4.9★", "Avg\nRating"),
                ],
              ),

              SizedBox(height: 30),

              // 📅 Recent Bookings
              Text(
                "Recent Bookings",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),

              SizedBox(height: 15),

              Expanded(
                child: ListView.builder(
                  itemCount: bookings.length,
                  itemBuilder: (context, index) {
                    final booking = bookings[index];
                    return Container(
                      margin: EdgeInsets.only(bottom: 12),
                      padding: EdgeInsets.all(15),
                      decoration: BoxDecoration(
                        color: Colors.white10,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                booking['date'] as String,
                                style: TextStyle(color: Colors.white54, fontSize: 13),
                              ),
                              Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  booking['status'] as String,
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 12),
                          Row(
                            children: [
                              Icon(Icons.circle, color: Colors.green, size: 10),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  booking['from'] as String,
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 6),
                          Row(
                            children: [
                              Icon(Icons.location_on, color: Colors.orange, size: 10),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  booking['to'] as String,
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                              Text(
                                booking['price'] as String,
                                style: TextStyle(
                                  color: Colors.greenAccent,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statCard(String value, String label) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(15),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.green.withOpacity(0.2),
              Colors.green.withOpacity(0.05),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(color: Colors.white54, fontSize: 11),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
