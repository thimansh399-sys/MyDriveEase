import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(DriveEaseApp());
}

class DriveEaseApp extends StatelessWidget {
  const DriveEaseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'DriveEase',
      theme: ThemeData.dark(),
      home: SplashScreen(),
    );
  }
}
