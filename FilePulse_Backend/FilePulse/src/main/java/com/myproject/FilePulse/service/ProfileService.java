package com.myproject.FilePulse.service;

import com.myproject.FilePulse.dao.ProfileDao;
import com.myproject.FilePulse.dto.ProfileDto;
import com.myproject.FilePulse.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ProfileService {

    @Autowired
    private ProfileDao repo;


    public ProfileDto createProfile(ProfileDto profileDto) {

        if(repo.existsByClerkId(profileDto.getClerkId())){
            return updateProfile(profileDto);
        }

        Profile profile = new Profile();

        profile.setClerkId(profileDto.getClerkId());
        profile.setFirstName(profileDto.getFirstName());
        profile.setLastName(profileDto.getLastName());
        profile.setEmail(profileDto.getEmail());
        profile.setPhotoUrl(profileDto.getPhotoUrl());
        profile.setCredits(5);
        profile.setCreatedAt(Instant.now());

        profile = repo.save(profile);

        ProfileDto profileDto1 = new ProfileDto();

        profileDto1.setId(profile.getId());
        profileDto1.setClerkId(profile.getClerkId());
        profileDto1.setEmail(profile.getEmail());
        profileDto1.setFirstName(profile.getFirstName());
        profileDto1.setLastName(profile.getLastName());
        profileDto1.setPhotoUrl(profile.getPhotoUrl());
        profileDto1.setCredits(profile.getCredits());
        profileDto1.setCreatedAt(profile.getCreatedAt());

        return profileDto1;
    }

    public ProfileDto updateProfile(ProfileDto profileDto){
        Profile existingProfile = repo.findByClerkId(profileDto.getClerkId());

        if(existingProfile != null) {
            if (profileDto.getEmail() != null && !profileDto.getEmail().isEmpty()) {
                existingProfile.setEmail(profileDto.getEmail());
            }
            if (profileDto.getFirstName() != null && !profileDto.getFirstName().isEmpty()) {
                existingProfile.setFirstName(profileDto.getFirstName());
            }
            if (profileDto.getLastName() != null && !profileDto.getLastName().isEmpty()) {
                existingProfile.setLastName(profileDto.getLastName());
            }
            if (profileDto.getPhotoUrl() != null && !profileDto.getPhotoUrl().isEmpty()) {
                existingProfile.setPhotoUrl(profileDto.getPhotoUrl());
            }

            repo.save(existingProfile);

            ProfileDto profileDto1 = new ProfileDto();

            profileDto1.setId(existingProfile.getId());
            profileDto1.setClerkId(existingProfile.getClerkId());
            profileDto1.setEmail(existingProfile.getEmail());
            profileDto1.setFirstName(existingProfile.getFirstName());
            profileDto1.setLastName(existingProfile.getLastName());
            profileDto1.setPhotoUrl(existingProfile.getPhotoUrl());
            profileDto1.setCredits(existingProfile.getCredits());
            profileDto1.setCreatedAt(existingProfile.getCreatedAt());

            return profileDto1;
        }
        return null;
    }

    public boolean existsByClerkId(String clerkId) {
        return repo.existsByClerkId(clerkId);
    }

    public void deleteProfile(String clerkId){
        Profile existingProfile = repo.findByClerkId(clerkId);
        if(existingProfile != null){
            repo.delete(existingProfile);
        }
    }

    public Profile getCurrentProfile() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new UsernameNotFoundException("User not Authenticated");
        }

        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();
        Profile profile = repo.findByClerkId(clerkId);

        if (profile == null) {
            try {
                Profile newProfile = new Profile();
                newProfile.setClerkId(clerkId);
                newProfile.setCredits(5);
                newProfile.setCreatedAt(Instant.now());
                profile = repo.save(newProfile);
            } catch (Exception e) {
                // If another request created it at the same time
                profile = repo.findByClerkId(clerkId);
            }
        }

        return profile;
    }

}
