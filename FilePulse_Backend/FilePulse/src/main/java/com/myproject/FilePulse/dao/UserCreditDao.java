package com.myproject.FilePulse.dao;

import com.myproject.FilePulse.model.Profile;
import com.myproject.FilePulse.model.UserCredits;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCreditDao extends JpaRepository<UserCredits,Integer> {

    Optional<UserCredits> findByClerkId(String clerkId);
}
