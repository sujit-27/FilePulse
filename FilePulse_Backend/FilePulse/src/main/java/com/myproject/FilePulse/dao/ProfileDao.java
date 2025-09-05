package com.myproject.FilePulse.dao;

import com.myproject.FilePulse.dto.ProfileDto;
import com.myproject.FilePulse.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface ProfileDao extends JpaRepository<Profile,Integer> {

    Optional<Profile> findByEmail(String email);

    Profile findByClerkId(String clerkId);

    Boolean existsByClerkId(String clerkId);

}
