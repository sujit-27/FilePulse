package com.myproject.FilePulse.service;

import com.myproject.FilePulse.dao.UserCreditDao;
import com.myproject.FilePulse.model.UserCredits;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    @Autowired
    private UserCreditDao repo;

    @Autowired
    private ProfileService profileService;

    public UserCredits createInitialCredits(String clerkId){

        UserCredits userCredits = new UserCredits();
        userCredits.setClerkId(clerkId);
        userCredits.setCredits(5);
        userCredits.setPlan("BASIC");

        return repo.save(userCredits);
    }

    public UserCredits getUserCredits(String clerkId){
        return repo.findByClerkId(clerkId).orElseGet(() -> createInitialCredits(clerkId));
    }

    public UserCredits getUserCredits(){
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    public Boolean hasEnoughCredits(int requiredCredits){
        UserCredits userCredits = getUserCredits();
        return userCredits.getCredits() >= requiredCredits;
    }

    public UserCredits consumeCredit(){
         UserCredits userCredits = getUserCredits();

         if(0 >= userCredits.getCredits()){
            return null;
         }

         userCredits.setCredits(userCredits.getCredits() - 1);

         return repo.save(userCredits);
    }

    public UserCredits addCredits(String clerkId, int creditsToAdd, String plan){
        UserCredits userCredits = repo.findByClerkId(clerkId)
                .orElseGet(() -> createInitialCredits(clerkId));

        userCredits.setCredits(userCredits.getCredits()+ creditsToAdd);
        userCredits.setPlan(plan);
        return repo.save(userCredits);
    }
}
